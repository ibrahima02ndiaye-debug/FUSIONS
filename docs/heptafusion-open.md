# Heptafusion & Ibra-OS Swarm 🧠🛠️

Welcome to the **Heptafusion & Ibra-OS** ecosystem — the future of AI-driven automotive intelligence and model merging.

## 🚀 Overview

This repository hosts two integrated systems:
1.  **Heptafusion**: An advanced engine for merging multiple LLMs into specialized "Brain IA" models using SLERP, DARE, and Weight Similarity Analysis.
2.  **Ibra-OS**: A multi-agent swarm designed for the automotive industry, featuring autonomous diagnosis, customer management, and a high-fidelity Cyber HUD.

## 📁 Business & Scaling Documents

- [**Business Plan**](docs/BUSINESS_PLAN.md): Vision, Market Analysis, and SaaS Financial Model.
- [**Marketing Plan**](docs/MARKETING_PLAN.md): Brand identity, acquisition strategy, and global scaling.
- [**Pitch Deck**](docs/PITCH_DECK.md): A 12-slide summary for investors and partners.

## 🛠️ Technical Resources

- [**Technical Documentation**](docs/TECHNICAL_DOCUMENTATION.md): Deep dive into architecture, agents, and merging algorithms.
- **HUD Interface**: Located at `ibra_os/dashboard/HUD.html`.

## ✨ Key Features

- **CLAW Mode**: High-autonomy reasoning for complex agent tasks.
- **Iterative SLERP**: Merge more than two models with precision.
- **Multimodal Support**: Seamless integration with **Gemma 4** and **Qwen2-VL**.
- **Cyber HUD**: Real-time diagnostic monitoring terminal.

## 💻 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set PYTHONPATH
export PYTHONPATH=$PYTHONPATH:.

# Run backend tests
python -m unittest discover tests

# Verify UI
python verify_hud.py
```

## 📜 License
See LICENSE file for details. Created for Ibra Services Inc.
