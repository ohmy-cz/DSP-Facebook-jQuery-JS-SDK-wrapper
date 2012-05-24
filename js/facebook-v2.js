function DSPFacebook()
{
	this.debug 					= false;
	this._defaultLoginButton 	= $('#installAppToFacebook');
	this._defaultLogoutButton 	= '#DSPFacebookLogout';
	this._user					= new Object();
	this.loggedInState 			= function(){return null;}
	this.defaultState 			= function(){return null;}
	this._defaultState			= null;
	this._openFBPageManagement	= false;
	this.requiredPermissions	= 'manage_pages';
	this._FBPages				= new Array();
	this.appId					= null;
	this.allPermissionsGranted 	= false;
	this._extendedPermissionsNeeded = function(){return null;};
	this._isConnected			= false;
	
	this.init = function()
	{
		var thisObj = this;
		
		this._addLoadingAnimation();
		
		if(document.location.href.indexOf('debug') != -1)
		{
			this.debug = true;
		}
		
	
		if(!thisObj._isLocalhost())
		{
			if(thisObj._hasRequiredLibs())
			{
				if($('#fb-root').length > 0)
				{
					try{
						FB.init({
						  appId      : $('#fbAppId').val(), // App ID
						  status     : true, // check login status
						  cookie     : true, // enable cookies to allow the server to access the session
						  xfbml      : true  // parse XFBML
						});
						
//						thisObj._defaultLoginButton.attr('href');

						thisObj.appId = thisObj._defaultLoginButton.attr('data-appid');
						
						thisObj.bindLoginButton(thisObj._defaultLoginButton);
						
						FB.getLoginStatus(function(response) {
							if(response.status == 'connected') {
								thisObj._isConnected = true;
								thisObj._permCheck();
							} else {
								thisObj._removeLoadingAnimation();
								
								if(thisObj.debug)
								{
									console.log('DSPFacebook: Facebook: Not yet connected with our app, binding the login button.');
								}
							}
						});
					} catch(e) {
						if(this.debug)
						{
							console.warn('DSPFacebook: Facebook lib error catched: '+e);
						}
					}
				} else {
					if(this.debug)
					{
						console.error('DSPFacebook: div id="fb-root" tag is missing!');
					}
				}
			}
		} else {
			if(this.debug)
			{
				console.error('DSPFacebook: this script can NOT work locally due to its nature!\nPlease test your page outside localhost.');
			}
		}
	}
	
	this._addLoadingAnimation = function()
	{
		this._defaultLoginButton
			.parent()
				.hide()
				.after($('<div class="center"><img class="center" src="/images/ajax-loader.gif" width="16" height="16" id="DSPFacebookPagesManagementLoading"/></div>'));
	}
	
	this._removeLoadingAnimation = function()
	{
		$('#DSPFacebookPagesManagementLoading')
			.parent()
				.prev()
					.show()
				.end()
				.remove();
	}
	
	this.bindLoginButton = function(where)
	{
		var thisObj = this;
		
		where
			.unbind('click')
			.click(function(){
				FB.login(function(response) {
					if(response.authResponse) {
//							console.log(response);
						/*if(thisObj.debug)
						{
							console.log('FB: Welcome!  Fetching your information.... ');
						}
						
						FB.api('/me', function(response) {
							if(thisObj.debug)
							{
//								console.log('Good to see you, ' + response.name + '.');
								console.log(response);
							}
							
							thisObj._user = response;
							*/
							thisObj._isConnected = true;
							thisObj._openFBPageManagement = true;
							thisObj._extendedPermissionsNeeded = function(){alert('Please grant the extended permissions to use this feature.');}
							thisObj._permCheck();
//							thisObj._loggedInState();
						//});
					} else {
						if(thisObj.debug)
						{
							console.log('User cancelled login or did not fully authorize.');
						}
						alert('Please grant all requested permissions to use this feature.');
					}
				}, {scope: thisObj.requiredPermissions});
				
				return false;
			});
	}
	
	
	
	
	this._loggedInState = function()
	{
		var thisObj = this;
		this.loggedInState(this);
		
						
		if(thisObj.debug)
		{
			console.log('Found logout buttons: '+$(this._defaultLogoutButton).length);
		}
		
		$(this._defaultLogoutButton)
			.click(function(){
				if(thisObj.debug)
				{
					console.log('Clicked!');
				}
				
				FB.logout(function(response) {
					if(thisObj.debug)
					{
						console.log(response);
						
						thisObj.defaultState(thisObj);
					}
				});
				
				return false;
			})
	}
	
	this._isLocalhost = function()
	{
		return (document.location.hostname.toLowerCase() != 'localhost' ? false : true);
	}
	
	this._hasRequiredLibs = function()
	{
		var hasRequiredLibs = true;
		
		try {
			// check if jQuery was loaded
			if(typeof(jQuery) == 'undefined') 
			{
				hasRequiredLibs = false;
				
				if(this.debug)
				{
					console.error('DSPFacebook: jQuery library not detected!');
				}
			}
			
			// check if Facebook lib was loaded
			if(typeof(FB) == 'undefined') 
			{
				hasRequiredLibs = false;
				
				if(this.debug)
				{
					console.error('DSPFacebook: Facebook library not detected!');
				}
			}
		} catch(e) {
			hasRequiredLibs = false;
			
			if(this.debug)
			{
				console.error('DSPFacebook: try...catch error occured; '+e);
			}
		}
		
		return hasRequiredLibs;
	}
	
	this._permCheck = function()
	{
		var thisObj = this;
		if(this._isConnected)
		{
			FB.api('/me/permissions', function(r){
				if(window.location.href.indexOf('debug') != -1)
				{
				   console.log('fb permissions;', r);
				}
				
				if(typeof(r.error) == 'undefined')
				{
					var reqPermissions = thisObj.requiredPermissions.split(',');
					var permissionGranted = new Array();
					
					for(i1 in reqPermissions)
					{
						permissionGranted[i1] = false;
						
						for(i in r.data[0])
						{
							if(reqPermissions[i1] == i && parseInt(r.data[0][i]) == 1)
							{
								permissionGranted[i1] = true;
							}
						}
					}
					
					thisObj.allPermissionsGranted = true;
					for(i in permissionGranted)
					{
						if(!permissionGranted[i])
						{
							thisObj.allPermissionsGranted = false;
						}
					}
					
					if(thisObj.allPermissionsGranted)
					{
						thisObj._loggedInState();
					} else {
						thisObj._extendedPermissionsNeeded();
					}
					
					thisObj._removeLoadingAnimation();
				} else {
					alert('An error occured while fetching the Facebook permissions:\n'+r.error.message+'\nPlease try again later.');
				}
			});
		}
	}
		
	this.getPages = function(callback)
	{
		var thisObj = this;
		
		// we can't filter /me/accounts to get only pages. That can be done only with FQL but from FQL we can't get access_token - that can be only obtained through the graph API.
		// solution => read both and combine.
		
		// delete previously loaded pages and load them again in case that some apge has been created since last time.
		if(thisObj._FBPages.length > 0)
		{
			thisObj._FBPages = new Array();
		}
		
		FB.api('/fql?q='+encodeURIComponent('SELECT page_id, type FROM page_admin WHERE uid = me() AND type != "APPLICATION" AND type != "APP"'), function(r1){
			if(typeof(r1.error) == 'undefined')
			{
				FB.api('/me/accounts', function(r2){
					if(typeof(r2.error) == 'undefined')
					{
						for(i1 in r1.data)
						{
							for(i2 in r2.data)
							{
								if(r2.data[i2]['id'] == r1.data[i1]['page_id'] && thisObj._FBPages.length <= 50)// facebook batch requests supports only up to 50 requests at the moment, so we'll only support 50 pages
								{
									r2.data[i2].installed = false;
									thisObj._FBPages.push(r2.data[i2]);
								}
							}
						}
						
						if(typeof(callback) != 'undefined')
						{
							callback(thisObj);
						}
					} else {
						alert('Facebook error occured while fetching the pages using the Graph API:\n'+r2.error.message+'\nPlease try again later.');
					}
				});
			} else {
				alert('Facebook error occured while fetching the pages using FQL:\n'+r1.error.message+'\nPlease try again later.');
			}
		});
	}
}

