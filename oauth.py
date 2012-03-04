client_id = "416575314846.apps.googleusercontent.com"
redirect_uri = "http://efforia.herokuapp.com/oauth2callback"
client_secret = "4O7-8yKLovNcwWfN5fzA2ptD"

#2. Your web application redirects the user to Google Authorization page
#3. User grants your web application access
print 'Visit the URL below in a browser to authorize'
print '%s?client_id=%s&redirect_uri=%s&scope=%s&response_type=code' % \
  ('https://accounts.google.com/o/oauth2/auth',
  client_id,
  redirect_uri,
  'http://gdata.youtube.com')

#4. Google redirects the user back to your web application and
#   returns an authorization code
auth_code = raw_input('Enter authorization code (parameter of URL): ')

#5. Your application requests an access token and refresh token from Google
data = urllib.urlencode({
  'code': auth_code,
  'client_id': client_id,
  'client_secret': client_secret,
  'redirect_uri': redirect_uri,
  'grant_type': 'authorization_code'
})
request = urllib2.Request(
  url='https://accounts.google.com/o/oauth2/token',
  data=data)
request_open = urllib2.urlopen(request)

#6. Google returns access token, refresh token, and expiration of
#   access token
response = request_open.read()
request_open.close()
tokens = json.loads(response)
access_token = tokens['access_token']
refresh_token = tokens['refresh_token']

#7. Access token can be used for all subsequent requests to Fusion Tables,
#   until the token expires
#request = urllib2.Request(
#  url='https://www.google.com/fusiontables/api/query?%s' % \
#    (urllib.urlencode({'access_token': access_token,
#                       'sql': 'SELECT * FROM 123456'})))
#request_open = urllib2.urlopen(request)
#response = request_open.read()
#request_open.close()
#print response

#8. When the access token expires,
#   the refresh token is used to request a new access token
data = urllib.urlencode({
  'client_id': client_id,
  'client_secret': client_secret,
  'refresh_token': refresh_token,
  'grant_type': 'refresh_token'})
request = urllib2.Request(
  url='https://accounts.google.com/o/oauth2/token',
  data=data)
request_open = urllib2.urlopen(request)
response = request_open.read()
request_open.close()
tokens = json.loads(response)
access_token = tokens['access_token']
