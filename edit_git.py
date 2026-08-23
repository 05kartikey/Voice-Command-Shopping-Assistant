import sys
filepath = sys.argv[1]
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

if 'git-rebase-todo' in filepath:
    for i in range(len(lines)):
        if lines[i].startswith('pick '):
            lines[i] = lines[i].replace('pick ', 'reword ', 1)
            break
else:
    for i in range(len(lines)):
        if 'unpolished version' in lines[i]:
            lines[i] = lines[i].replace('unpolished version', 'feat: initial commit of Voice Command Shopping Assistant')

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(lines)
