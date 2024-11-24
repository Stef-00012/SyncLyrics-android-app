# SyncLyrics Android App

SyncLyrics is an app for Android which fetches the song you're listening to on Spotify and shows its synced lyrics from multiple sources ([Musixmatch](https://musixmatch.com), [Lrclib.net](https://lrclib.net) and [Netease](https://music.163.com/)).

## Installation

Just download the APK from the github [action artifact](https://github.com/Stef-00012/SyncLyrics-android-app/actions/runs/11994897595/artifacts/2229401975) (This link might be outdated, to get the newest build check the latest APK build action).

## Build

If you want to build the app yourself,

> [!NOTE]
> You must have an Expo account and install Java and Android SDK

1. Install eas CLI, `npm i -g eas-cli`
2. Run the build command, `eas build --clear-cache --platform android --profile preview --local` (You can also remove `--local` to build it on expo server instead of your local PC).

## Setup

After installation you must create an app on spotify and add your own client ID and client secret in the settings, once you added them, restart the app for it to start working.