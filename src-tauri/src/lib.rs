use std::sync::Mutex;
use std::time::Duration;

use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  Emitter, Manager, WindowEvent,
};
use tauri_plugin_notification::NotificationExt;

/// 지압 리마인더 설정/진행 상태 (Rust 백그라운드 타이머가 사용)
struct ReminderState {
  enabled: bool,
  interval_secs: u64,
  elapsed_secs: u64,
}

impl Default for ReminderState {
  fn default() -> Self {
    Self {
      enabled: false,
      interval_secs: 3600, // 기본 60분
      elapsed_secs: 0,
    }
  }
}

/// 프론트엔드가 리마인더 설정을 갱신 (켜기/끄기, 간격)
#[tauri::command]
fn set_reminder(state: tauri::State<Mutex<ReminderState>>, enabled: bool, interval_minutes: u64) {
  if let Ok(mut s) = state.lock() {
    s.enabled = enabled;
    s.interval_secs = interval_minutes.max(1) * 60;
    s.elapsed_secs = 0; // 설정이 바뀌면 카운트 초기화
  }
}

/// 프론트엔드가 임의의 시스템 알림을 띄울 때 (예: 타이머 완료)
#[tauri::command]
fn notify(app: tauri::AppHandle, title: String, body: String) {
  let _ = app.notification().builder().title(title).body(body).show();
}

/// macOS 알림 권한 확인/요청 — 허용되면 true
#[tauri::command]
fn request_notification_permission(app: tauri::AppHandle) -> bool {
  use tauri_plugin_notification::PermissionState;
  if let Ok(PermissionState::Granted) = app.notification().permission_state() {
    return true;
  }
  matches!(
    app.notification().request_permission(),
    Ok(PermissionState::Granted)
  )
}

fn show_main_window(app: &tauri::AppHandle) {
  if let Some(window) = app.get_webview_window("main") {
    let _ = window.show();
    let _ = window.unminimize();
    let _ = window.set_focus();
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .manage(Mutex::new(ReminderState::default()))
    .invoke_handler(tauri::generate_handler![
      set_reminder,
      notify,
      request_notification_permission
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // ── 메뉴바 트레이 ──
      let show_i = MenuItem::with_id(app, "show", "손길 열기", true, None::<&str>)?;
      let quick_i = MenuItem::with_id(app, "quick", "빠른 지압 시작", true, None::<&str>)?;
      let quit_i = MenuItem::with_id(app, "quit", "종료", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show_i, &quick_i, &quit_i])?;

      TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("손길")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
          "show" => show_main_window(app),
          "quick" => {
            show_main_window(app);
            let _ = app.emit("go-home", ());
          }
          "quit" => app.exit(0),
          _ => {}
        })
        .on_tray_icon_event(|tray, event| {
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            show_main_window(tray.app_handle());
          }
        })
        .build(app)?;

      // ── 창 닫기(X) → 종료 대신 트레이로 숨김 ──
      if let Some(window) = app.get_webview_window("main") {
        let win = window.clone();
        window.on_window_event(move |event| {
          if let WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = win.hide();
          }
        });
      }

      // ── 백그라운드 리마인더 타이머 (30초마다 체크) ──
      let handle = app.handle().clone();
      std::thread::spawn(move || {
        const TICK_SECS: u64 = 30;
        loop {
          std::thread::sleep(Duration::from_secs(TICK_SECS));
          let should_fire = {
            let state = handle.state::<Mutex<ReminderState>>();
            let mut s = match state.lock() {
              Ok(s) => s,
              Err(_) => continue,
            };
            if !s.enabled {
              s.elapsed_secs = 0;
              false
            } else {
              s.elapsed_secs += TICK_SECS;
              if s.elapsed_secs >= s.interval_secs {
                s.elapsed_secs = 0;
                true
              } else {
                false
              }
            }
          };
          if should_fire {
            let _ = handle
              .notification()
              .builder()
              .title("손길 ✋")
              .body("오래 앉아계셨어요. 손 지압으로 잠깐 쉬어가세요.")
              .show();
          }
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
