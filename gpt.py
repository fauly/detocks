import os
from pathlib import Path

OUTPUT_FILE_PREFIX = 'AllScripts'
MAX_FILE_SIZE = 4000  # Maximum file size in characters
output_file_counter = 1
output_file_content = ""
total_chars = 0

# First pass to calculate the total number of characters in all files
for root, dirs, files in os.walk('.'):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')  # don't visit node_modules directories
    for file_num, file in enumerate(files, start=1):
        if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
            print(f"Processing: {os.path.join(root, file)}")
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                file_content = f"\n--- File ({os.path.join(root, file)}) ---\n" + f.read()
                total_chars += len(file_content)

# Calculate the total number of output files we will have
total_output_file_counter = total_chars // MAX_FILE_SIZE
if total_chars % MAX_FILE_SIZE != 0:
    total_output_file_counter += 1

# Second pass to split the files
for root, dirs, files in os.walk('.'):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')  # don't visit node_modules directories
    for file_num, file in enumerate(files, start=1):
        if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
            print(f"Processing: {os.path.join(root, file)}")
            with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                file_content = f"\n--- File ({os.path.join(root, file)}) ---\n" + f.read()
                if len(output_file_content + file_content) > MAX_FILE_SIZE:
                    # Write current content to a new file
                    with open(f"{OUTPUT_FILE_PREFIX}_{output_file_counter}.txt", 'w', encoding='utf-8') as out_f:
                        out_f.write(output_file_content)
                        out_f.write(f"\n--- End of Message {output_file_counter} out of {total_output_file_counter}---\n")
                    output_file_counter += 1
                    output_file_content = file_content
                else:
                    output_file_content += file_content

# Write the remaining content to the last output file
if output_file_content:
    with open(f"{OUTPUT_FILE_PREFIX}_{output_file_counter}.txt", 'w', encoding='utf-8') as out_f:
        out_f.write(output_file_content)
        out_f.write(f"\n--- End of Message {output_file_counter} out of {total_output_file_counter}---\n")
