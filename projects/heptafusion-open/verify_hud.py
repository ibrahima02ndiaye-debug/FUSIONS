from playwright.sync_api import sync_playwright
import os

def run_verification(page):
    # HUD.html is a static file, we can access it via file:// protocol
    # The file is in ibra_os/dashboard/HUD.html relative to projects/heptafusion-open
    current_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = os.path.join(current_dir, "ibra_os/dashboard/HUD.html")
    page.goto(f"file://{filepath}")
    page.wait_for_timeout(1000)

    # 1. Switch language
    page.click("button:has-text('EN')")
    page.wait_for_timeout(500)

    # 2. Trigger Vision button
    page.click("#btn-camera")
    page.wait_for_timeout(500)

    # 3. Trigger Neural Scan button (formerly DIAG)
    page.click("#btn-diag")
    page.wait_for_timeout(5000) # Wait for BioFlux animation and progress bar

    # Take screenshot of the "Technological Fusion Lab" HUD
    screenshot_path = os.path.join(current_dir, "hud_fusion_lab.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            context.close()
            browser.close()
