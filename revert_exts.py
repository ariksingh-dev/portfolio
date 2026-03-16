import os
import glob

files = glob.glob('/Users/arik/Desktop/Portfolio_coding/portfolio/*.html')
files.append('/Users/arik/Desktop/Portfolio_coding/portfolio/assets/js/main.js')

for path in files:
    with open(path, 'r') as f:
        content = f.read()
    
    # We replaced .png with .jpg for image12, image15, image18, image22, image23, image27, image28, image29
    # image6, project*_title
    if '.jpg' in content:
        content = content.replace('.jpg', '.png')
        with open(path, 'w') as f:
            f.write(content)
        print(f"Reverted extensions in {os.path.basename(path)}")
