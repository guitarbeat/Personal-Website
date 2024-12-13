# rename_js_to_jsx.py
import os
from pathlib import Path

def rename_js_files(directory):
    # Convert the directory path to a Path object
    path = Path(directory)
    
    if not path.exists():
        print(f"Error: The directory '{directory}' does not exist.")
        return
    
    # Walk through all files in the directory
    for file_path in path.rglob('*.jsx'):  # rglob finds all .js files in subdirectories
        new_name = file_path.with_suffix('.js')
        
        # Rename the file if it doesn't already have a .jsx extension
        if file_path != new_name:
            try:
                os.rename(file_path, new_name)
                print(f"Renamed: {file_path} -> {new_name}")
            except Exception as e:
                print(f"Error renaming {file_path}: {e}")
        else:
            print(f"Skipping {file_path}, already has .jsx extension.")

# Example usage: Specify the root directory of your project
rename_js_files("/Users/aaron/Desktop/Side Projects/Personal-Website/portfolio-2/src")
