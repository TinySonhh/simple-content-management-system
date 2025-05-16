import os
from datetime import datetime
import sys
import shutil

# Set the path to the directory you want to search in
path = "."
appName = "app"

if len(sys.argv) > 1:
    path = sys.argv[1]
    appName = os.path.basename(os.path.normpath(path))
else:
    path = "."    

print (appName)
# Set the path to the destination folder
destination_folder = "changes"
if not os.path.exists(destination_folder):
    os.makedirs(destination_folder)

# Set the time after which you want to find the files (in this example, 2023-11-01 00:00:00)
#time_after = datetime.datetime(2023, 11, 21, 12, 0, int(12.09))

now = datetime.now()
current_time = now.strftime("%Y-%m-%d %H:%M:%S")
current_time_rev = now.strftime("%Y%m%d%H%M%S")


# Create the _revision\latest.php file if not existed
_revision_path = os.path.join(path,"_revision")
if not os.path.exists(_revision_path):
    os.makedirs(_revision_path)

_revision_file="latest.php"
revisionHistoryFileName=os.path.join(_revision_path,_revision_file)

revisionHistoryFile = open(revisionHistoryFileName, "w")
revisionHistoryFile.write("<?php $CACHE_REVISION_NO=\"" + current_time_rev + "\"; ?>")
revisionHistoryFile.close()


#open text file in read mode
lastChangedFileName="lastChanges.txt"
lastChangedDateTime=current_time
if os.path.exists(lastChangedFileName) :
    lastChangedFile = open(lastChangedFileName, "r")
    lastChangedDateTime = lastChangedFile.read()
    lastChangedFile.close()
    lastChangedFile_bk = open(lastChangedFileName + ".bk", "w")
    lastChangedFile_bk.write(lastChangedDateTime)
    lastChangedFile_bk.close()

time_after = datetime.strptime(lastChangedDateTime, '%Y-%m-%d %H:%M:%S')

# Set the file extensions you want to filter by
extensions = [
    ".js", ".php", ".html" , ".css", ".ts",
    ".png", ".jpg", ".jpeg", ".ico", ".gif", ".svg", ".webp", ".tif", ".tiff",
    ".mp3", ".wav", ".ogg", ".aiff", ".flac", ".aac",
    ".json",
    ".webmanifest", ".htaccess"
]

# Get the list of files that match the criteria
files = []
for root, dirs, filenames in os.walk(path):
    for filename in filenames:
        if "google-api" not in root and ( (os.path.splitext(filename)[1] in extensions) or (filename in extensions) ) and datetime.fromtimestamp(os.path.getmtime(os.path.join(root, filename))) > time_after:
            files.append(os.path.join(root, filename))

# Copy the files to the destination folder
for file in files:
    # print (file);
    temp_path = file[file.find("\\"+appName+"\\") + len("\\"+appName+"\\"):];
    destination_file = destination_folder + "\\" + temp_path
    # print (destination_file);
    os.makedirs(os.path.dirname(destination_file), exist_ok=True)
    shutil.copy(file, destination_file)

# Print the list of files
# Print the list of copied files
if len(files) > 0:
    print("The following files have been copied to the destination folder:")
    for file in files:
        print(file)

# Update last changed date time
lastChangedFile = open(lastChangedFileName, "w")
lastChangedFile.write(current_time)
lastChangedFile.close()