-- Author: Markus Bordihn (mbordihn@google.com)
-- Description: Open the passed URL over Safari

on run argv

	tell application "Safari"
		make new document with properties {URL: (item 1 of argv)}
	end tell

	delay 60

end run
