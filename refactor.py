import os
import re

directories = ['src/pages', 'src/components']

replacements = {
    r'\bfont-black\b': 'font-semibold',
    r'\btracking-tighter\b': '',
    r'\btracking-tight\b': '',
    r'\btracking-widest\b': '',
    r'\btracking-\[.*?\]\b': '',
    r'\brounded-\[.*?\]\b': 'rounded-lg',
    r'\brounded-3xl\b': 'rounded-lg',
    r'\brounded-2xl\b': 'rounded-md',
    r'\bshadow-elevated\b': 'shadow-sm',
    r'\bshadow-3xl\b': 'shadow-lg',
    r'\bshadow-2xl\b': 'shadow-md',
    r'\bshadow-lg\b': 'shadow-md',
    r'\banimate-float\b': '',
    r'\banimate-pulse-ring\b': '',
    r'\bbackdrop-blur-\w+\b': '',
    r'\bbackdrop-blur\b': '',
    r'\bh-16 px-10\b': 'h-11 px-6',
    r'\bh-14 px-8\b': 'h-10 px-4',
    r'\bh-14 px-10\b': 'h-10 px-6',
    r'\bh-16 px-12\b': 'h-11 px-8',
    r'\bhover:-translate-y-1\b': '',
    r'\bhover:-translate-y-2\b': '',
    r'\bhover:scale-105\b': '',
    r'\bhover:scale-\[.*?\]\b': '',
    r'\bactive:scale-95\b': '',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    # Clean up double spaces caused by removing classes
    content = re.sub(r' +', ' ', content)
    content = re.sub(r' \]', ']', content)
    content = re.sub(r' "', '"', content)
    
    with open(filepath, 'w') as f:
        f.write(content)

for directory in directories:
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

print("CSS classes flattened successfully.")
