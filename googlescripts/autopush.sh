   while [[ true ]]
    do
        chsum2=$(find -L . -type f -exec md5 {} \;)
        if [[ $chsum1 != $chsum2 ]] ; then
            echo "Found a file change, executing clasp push..."
            clasp push
            chsum1=$chsum2
        fi
        sleep 0.5
    done