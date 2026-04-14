# Technical Documentation: Ibra-OS & Heptafusion

## 1. System Overview
Ibra-OS is a multi-agent system (Swarm) built on top of a modular Python architecture. It interacts with the **Heptafusion** library for dynamic model weight merging.

## 2. Core Components

### 2.1 Heptafusion (Model Merging)
Located in `heptafusion/`, this module implements advanced weight merging techniques.
- **`merge.py`**: Supports Weighted Average, SLERP (Spherical Linear Interpolation), and DARE.
    - `iterative_slerp`: Merges multiple models by recursively applying SLERP.
- **`analyzer.py`**: Computes cosine similarity between model tensors to provide empirical guidance for merging ratios.

### 2.2 Ibra-OS Agents
Located in `ibra_os/agents/`:
- **SecretaryAgent**: The orchestrator.
    - **Hermes Mode**: Keyword-based intent detection.
    - **CLAW Mode**: Autonomous reasoning with multi-step plan generation.
- **VisionAgent**: Utilizes `Qwen2-VL` for visual diagnostic tasks.
- **PhysicsAgent**: Processes audio/vibration data for mechanical diagnostics.

### 2.3 Persistence Layer
Located in `ibra_os/database/`:
- **`db_manager.py`**: Manages a SQLite database (`garage_memory.db`).
- **Schema**:
    - `clients`: Customer details.
    - `appointments`: Scheduling history.
    - `diagnostic_history`: Stores AI-scored diagnosis logs and confidence levels.

## 3. UI/UX: The Cyber HUD
Located in `ibra_os/dashboard/`:
- **`HUD.html`**: A mobile-responsive dashboard using CSS variables for a "Cyber" aesthetic.
- **Features**: Real-time terminal logs, system status indicators, and i18n support.

## 4. Setup & Deployment

### 4.1 Prerequisites
- Python 3.10+
- PyTorch & Transformers
- SQLite3

### 4.2 Installation
```bash
pip install -r requirements.txt
export PYTHONPATH=$PYTHONPATH:.
```

### 4.3 Running the System
```bash
python -m ibra_os.main
```

## 5. Testing
The project uses `unittest` for backend verification.
```bash
python -m unittest discover tests
```
For frontend verification, use the Playwright script:
```bash
python verify_hud.py
```
