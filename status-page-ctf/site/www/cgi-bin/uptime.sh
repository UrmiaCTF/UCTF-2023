#!/bin/bash

echo -ne "Content-type: text/html\n\n";

cat <<- HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uptime</title>
</head>
<body>
  <p>$(date)</p>
  <p>$(uptime)</p>
</body>
</html>
HTML
