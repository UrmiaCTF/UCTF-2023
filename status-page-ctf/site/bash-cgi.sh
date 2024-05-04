#!/bin/sh

if [ ! -f "${SCRIPT_FILENAME}" ]; then
	echo 'Status: 404 Not Found'
	echo 'Content-type: text/html'
	echo

	echo "<HTML><HEAD><TITLE>404 Not Found</TITLE></HEAD>"
	echo "<BODY><H1>404 Not Found</H1>"
	echo "The requested URL was not found"
	echo "</BODY></HTML>"

	exit 1
fi

exec /opt/nsjail/bin/nsjail -C /opt/nsjail/etc/cgi.cfg -- /opt/bash/bin/bash "${SCRIPT_FILENAME}"