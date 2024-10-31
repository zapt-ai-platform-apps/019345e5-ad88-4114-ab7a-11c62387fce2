# IPTV Player App

## Description

The IPTV Player App allows users to stream IPTV channels by entering their username and password. Users can view a list of available channels, select a channel to watch, and stream it directly within the app.

## User Journey

1. **Access the App**

   - The user navigates to the IPTV Player App.

2. **Enter Credentials**

   - The user is presented with a form to enter their **Username** and **Password**.
   - The user fills in their credentials.

3. **Fetch Channels**

   - The user clicks on the **Get Channels** button.
   - The app fetches the IPTV channel playlist based on the provided credentials.
   - If the credentials are valid, a list of channels is displayed.
   - If there is an error (e.g., invalid credentials), an error message is shown.

4. **View Channel List**

   - The user sees a list of available channels fetched from their IPTV subscription.
   - The channels are listed by their names.

5. **Select and Play a Channel**

   - The user clicks on a channel from the list.
   - The selected channel begins to play in the video player on the right side.
   - The user can watch the live stream of the selected channel.

6. **Interact with the Player**

   - The user can control the playback using the video controls (play, pause, volume, fullscreen).
   - The user can select different channels from the list to switch streams.

7. **Error Handling**

   - If the app encounters any errors during fetching or playback, appropriate error messages are displayed to the user.

## External API

- **IPTV Provider API**

  - The app uses the IPTV provider's API to fetch the M3U playlist based on the user's credentials.
  - The playlist URL format is:

    ```
    https://apsmart.in:80/get.php?username=USERNAME&password=PASSWORD&type=m3u_plus&output=ts
    ```

  - Users must have valid IPTV credentials to access the channels.

## Environment Variables

- **Sentry Error Logging**

  - The app uses Sentry for error logging. Please set the following environment variables in a `.env` file:

    ```
    VITE_PUBLIC_SENTRY_DSN=your_sentry_dsn
    VITE_PUBLIC_APP_ENV=your_app_environment
    VITE_PUBLIC_APP_ID=your_app_id
    ```

    - `VITE_PUBLIC_SENTRY_DSN`: Your Sentry Data Source Name.
    - `VITE_PUBLIC_APP_ENV`: The environment the app is running in (e.g., production, development).
    - `VITE_PUBLIC_APP_ID`: Your application ID.

## Notes

- The app does not store any user credentials; they are used only to fetch the channel playlist.
- Users must ensure they have the rights and permissions to access and stream the IPTV content.
- The app supports streaming of channels provided in MPEG-TS format via HTTP using HLS.js.
- For optimal performance, use modern browsers that support HLS streaming.
