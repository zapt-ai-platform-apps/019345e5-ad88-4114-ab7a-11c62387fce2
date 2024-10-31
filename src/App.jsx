import { createSignal, createEffect, Show, For, onCleanup } from 'solid-js';
import Hls from 'hls.js';

function App() {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [channels, setChannels] = createSignal([]);
  const [selectedChannelUrl, setSelectedChannelUrl] = createSignal('');

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  let hls = null;
  let videoRef;

  createEffect(() => {
    if (selectedChannelUrl()) {
      initializePlayer();
    }
  });

  onCleanup(() => {
    if (hls) {
      hls.destroy();
    }
  });

  const fetchPlaylist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setChannels([]);
    setSelectedChannelUrl('');
    try {
      const url = `https://apsmart.in:80/get.php?username=${encodeURIComponent(username())}&password=${encodeURIComponent(password())}&type=m3u_plus&output=ts`;
      const response = await fetch(url);
      if (!response.ok) {
        setError('Failed to fetch playlist. Please check your credentials.');
        setLoading(false);
        return;
      }
      const playlistText = await response.text();
      const channelList = parseM3UPlaylist(playlistText);
      setChannels(channelList);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the playlist');
    } finally {
      setLoading(false);
    }
  };

  const parseM3UPlaylist = (text) => {
    const lines = text.split('\n');
    const channels = [];
    let currentChannel = {};
    for (let line of lines) {
      if (line.startsWith('#EXTINF')) {
        const info = line.match(/#EXTINF:-1 (.+?),(.+)/);
        if (info) {
          const attributesText = info[1];
          const channelName = info[2];
          const attributes = {};
          attributesText.split(' ').forEach(attr => {
            const [key, value] = attr.split('=');
            if (key && value) {
              attributes[key] = value.replace(/"/g, '');
            }
          });
          currentChannel = {
            name: channelName,
            ...attributes
          };
        }
      } else if (line && !line.startsWith('#')) {
        currentChannel.url = line;
        channels.push(currentChannel);
        currentChannel = {};
      }
    }
    return channels;
  };

  const playChannel = (url) => {
    setSelectedChannelUrl(url);
  };

  const initializePlayer = () => {
    if (hls) {
      hls.destroy();
    }
    if (Hls.isSupported() && selectedChannelUrl()) {
      hls = new Hls();
      hls.loadSource(selectedChannelUrl());
      hls.attachMedia(videoRef);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoRef.play();
      });
    } else if (videoRef.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.src = selectedChannelUrl();
      videoRef.addEventListener('loadedmetadata', function () {
        videoRef.play();
      });
    } else {
      setError('This browser does not support HLS playback.');
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 p-4">
      <h1 class="text-4xl font-bold text-center mb-8 text-purple-600">IPTV Player</h1>

      <form class="max-w-md mx-auto mb-8" onSubmit={fetchPlaylist}>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username()}
            onInput={(e) => setUsername(e.target.value)}
            class="w-full p-2 border border-gray-300 rounded box-border"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password()}
            onInput={(e) => setPassword(e.target.value)}
            class="w-full p-2 border border-gray-300 rounded box-border"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-blue-600"
          disabled={loading()}
        >
          {loading() ? 'Loading...' : 'Get Channels'}
        </button>
      </form>

      <Show when={error()}>
        <div class="max-w-md mx-auto mb-4 text-red-500">{error()}</div>
      </Show>

      <Show when={channels().length > 0}>
        <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 class="text-2xl font-bold mb-4 text-purple-600">Channels</h2>
            <ul class="overflow-y-auto max-h-screen">
              <For each={channels()}>
                {(channel) => (
                  <li
                    class="cursor-pointer p-2 border-b border-gray-300 hover:bg-gray-200"
                    onClick={() => playChannel(channel.url)}
                  >
                    {channel.name}
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div class="relative">
            <Show when={selectedChannelUrl()}>
              <h2 class="text-2xl font-bold mb-4 text-purple-600">Now Playing</h2>
              <div class="aspect-w-16 aspect-h-9">
                <video
                  ref={videoRef}
                  controls
                  class="w-full h-full"
                />
              </div>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;