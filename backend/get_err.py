import sys
with open('C:/Users/sanjay/.gemini/antigravity-ide/brain/837d3136-affb-4262-a4cd-3f566ae3821d/.system_generated/tasks/task-41.log', 'r') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if '500 -' in l:
        print(''.join(lines[max(0, i-30):i+5]))
        print("-" * 50)
