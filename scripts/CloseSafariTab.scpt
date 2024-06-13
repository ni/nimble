-- Author: Markus Bordihn (mbordihn@google.com)
-- Description: Close the passed Tab and quit the browser if no other tabs are open.

on run argv

	tell application "Safari"
		close documents where URL = (item 1 of argv)
	end tell

	tell application "Safari"
		if number of tabs in windows <= 0 or (number of documents = 1 and document 1's source = "")
			quit
		end if
	end tell

end run
