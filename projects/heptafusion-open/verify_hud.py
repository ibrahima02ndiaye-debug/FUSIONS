from playwright.sync_api import sync_playwright
import os

def run_verification(page):
    # HUD.html is a static file, we can access it via file:// protocol
    # Fix path to be relative to the repository root if needed, or use full path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = os.path.join(base_dir, "ibra_os/dashboard/HUD.html")
    page.goto(f"file://{filepath}")
    page.wait_for_timeout(1000)

    # 1. Switch language
    page.click("button:has-text('EN')")
    page.wait_for_timeout(500)

    # 2. Trigger Vision button
    page.click("#btn-camera")
    page.wait_for_timeout(500)

    # 3. Trigger Diagnostic button
    page.click("#btn-diag")
    page.wait_for_timeout(3000) # Wait for progress bar to finish

    # Take screenshot of the "Cyber" HUD
    page.screenshot(path="/home/jules/verification/screenshots/hud_cyber.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            context.close()
            browser.close()
