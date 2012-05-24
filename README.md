Facebook-jQuery-JS-SDK-wrapper
==============================

This is a wrapper that handles the login &amp; return of a user and can fetch the user's Facebook pages.

- Detects if running on a localhost, yelling an alert if it does to notify you that the script needs to run online to work
- Detects the presence of all required libraries, yields according error if any missing
- You can define a handler for a logged in state.
- You can define the permissions you require for your use; default is manage_pages to be able to obtain the user's Facebook pages.
 
Requirements:
-------------
- Facebook JS SDK; https://developers.facebook.com/docs/reference/javascript/
- jQuery; http://www.jquery.com

Installation:
-------------
- Load all required libraries before the script;
- Initialize the Facebook JS SDK, add your Facebook app ID.
- Initialize the wrapper object somewhere in your script or inline in HTML; for example with var DSPFBWrapper = new DSPFacebook(); DSPFBWrapper.init();
- (optional) If you need more data from FB which require special permissions, define them separated with comma like this: DSPFBWrapper.requiredPermissions='manage_pages,publish_stream'; before the DSPFBWrapper.init().
- Put the wrapper script and the updated HTML page online
- Open the page in your favorite browser :)

Todo:
-----
- Cleanup
- New features