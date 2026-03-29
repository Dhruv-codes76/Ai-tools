with open('./frontend/src/components/NewsCard/index.tsx', 'r') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'bg-black/95' in line:
            print(f"{i+1}: {line.strip()}")
        if 'Share2 className' in line:
            # print surrounding lines
            start = max(0, i-6)
            end = min(len(lines), i+4)
            print("--- Share button ---")
            for j in range(start, end):
                print(f"{j+1}: {lines[j].strip()}")
