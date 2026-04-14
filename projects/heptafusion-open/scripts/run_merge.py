import argparse
import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from heptafusion.config import load_config, validate_config
from heptafusion.merge import merge_models

def main():
    parser = argparse.ArgumentParser(description="Heptafusion Model Merger")
    parser.add_argument("--config", type=str, required=True, help="Path to the YAML config file")
    args = parser.parse_args()

    if not os.path.exists(args.config):
        print(f"Error: Config file {args.config} not found.")
        sys.exit(1)

    config = load_config(args.config)
    validate_config(config)

    print(f"Starting merge process using method: {config['method']}")
    print(f"Base model: {config['base_model']}")

    model_paths = [m['model'] for m in config.get('merge_models', [])]
    weights = [m.get('weight', 1.0) for m in config.get('merge_models', [])]
    # Add base model weight if needed, here we assume it's part of the list or handled in merge_models

    merge_models(
        base_model_path=config['base_model'],
        model_paths=model_paths,
        method=config['method'],
        weights=None, # TBD: handle weights properly in merge_models for N models
        output_path=config.get('output_path', './fused-model')
    )

    print("Merge completed successfully.")

if __name__ == "__main__":
    main()
