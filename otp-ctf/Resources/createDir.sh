#!/bin/bash

generate_random_string() {
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w "$1" | head -n 1
}

create_folder_with_flag() {
    folder_name="$1"
    mkdir -p "$folder_name"
    flag_file="$folder_name/flag.txt"
    random_text="CTF{$(generate_random_string 10)}"
    echo "$random_text" > "$flag_file"
}

create_folders_with_flags() {
    num_folders="$1"
    for ((i=1; i<=num_folders; i++)); do
        folder_name=$(generate_random_string 8)
        create_folder_with_flag "$folder_name"
    done
}

create_folders_with_flags 100