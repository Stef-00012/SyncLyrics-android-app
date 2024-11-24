import {
	SyncLyrics,
	type TokenData,
	type FormattedLyric,
} from "@stef-0012/synclyrics";
import {
	Text,
	View,
	TextInput,
	StatusBar,
	Alert,
} from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LyricsContainer from "@/components/LyricsContainer";
import { Pressable } from "@react-native-material/core";
import Tooltip from "react-native-walkthrough-tooltip";
import NetInfo from "@react-native-community/netinfo";
import * as SplashScreen from "expo-splash-screen";
import SettingsModal from "@/components/Modal";
import getStyles from "@/assets/styles/index";
import { useState, useEffect } from "react";
import Toast from "react-native-root-toast";
import * as db from "@/functions/database";
import Header from "@/components/Header";
import { useFonts } from "expo-font";
import {
	ClickOutsideProvider,
	useClickOutside,
} from "react-native-click-outside";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Link } from "expo-router";

interface SpotifyArtist {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

SplashScreen.preventAutoHideAsync();

export default function Index() {
	const [loaded, error] = useFonts({
		"Arimo-Nerd-Font": require("../assets/fonts/ArimoNerdFont-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded || error) SplashScreen.hideAsync();

		if (error) console.error(error);
	}, [loaded, error]);

	const [showSettings, setShowSettings] = useState<boolean>(false);
	const closeSettingsRef = useClickOutside<View>(() => setShowSettings(false));

	const [instrumentalLyricIndicator, setInstrumentalLyricIndicator] =
		useState<string>(db.get("instrumentalLyricIndicator") || "");
	const [
		settingsInstrumentalLyricIndicator,
		setSettingsInstrumentalLyricIndicator,
	] = useState<string>(instrumentalLyricIndicator);

	const [lyricsFontSize, setLyricsFontSize] = useState<string>(
		db.get("lyricsFontSize") || "20",
	);
	const [settingsLyricsFontSize, setSettingsLyricsFontSize] =
		useState<string>(lyricsFontSize);

	const [currentLyricColor, setCurrentLyricColor] = useState<string>(
		db.get("currentLyricColor") || "#1ed760",
	);
	const [settingsCurrentLyricColor, setSettingsCurrentLyricColor] =
		useState<string>(currentLyricColor);

	const [previousLyricsColor, setPreviousLyricsColor] = useState<string>(
		db.get("previousLyricsColor") || "#302f2f",
	);
	const [settingsPreviousLyricsColor, setSettingsPreviousLyricsColor] =
		useState<string>(previousLyricsColor);

	const [nextLyricsColor, setNextLyricsColor] = useState<string>(
		db.get("nextLyricsColor") || "#fff",
	);
	const [settingsNextLyricsColor, setSettingsNextLyricsColor] =
		useState<string>(nextLyricsColor);

	const [backgroundColor, setBackgroundColor] = useState<string>(
		db.get("backgroundColor") || "#121212",
	);
	const [settingsBackgroundColor, setSettingsBackgroundColor] =
		useState<string>(backgroundColor);

	const [headerColor, setHeaderColor] = useState<string>(
		db.get("headerColor") || "#1a1d21",
	);
	const [settingsHeaderColor, setSettingsHeaderColor] =
		useState<string>(headerColor);

	const [spotifyClientID, setSpotifyClientID] = useState<string | null>(
		db.get("spotifyClientID"),
	);
	const [settingsSpotifyClientID, setSettingsSpotifyClientID] = useState<
		string | null
	>(spotifyClientID);
	let _spotifyClientID: string | null = spotifyClientID;

	const [spotifyClientSecret, setSpotifyClientSecret] = useState<string | null>(
		db.get("spotifyClientSecret"),
	);
	const [settingsSpotifyClientSecret, setSettingsSpotifyClientSecret] =
		useState<string | null>(spotifyClientSecret);
	let _spotifyClientSecret: string | null = spotifyClientSecret;

	const [
		instrumentalLyricIndicatorTooltipVisible,
		setInstrumentalLyricIndicatorTooltipVisible,
	] = useState<boolean>(false);

	const [hideSpotifyClientID, setHideSpotifyClientID] = useState<boolean>(true);
	const [hideSpotifyClientSecret, setHideSpotifyClientSecret] =
		useState<boolean>(true);

	const [spotifyRefreshToken, setSpotifyRefreshToken] = useState<string | null>(
		db.get("spotifyRefreshToken"),
	);
	let _spotifyRefreshToken: string | null = spotifyRefreshToken;

	const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(
		db.get("spotifyAccessToken"),
	);
	let _spotifyAccessToken: string | null = spotifyAccessToken;

	const [spotifyAccessTokenExpiration, setSpotifyAccessTokenExpiration] =
		useState<string | null>(db.get("spotifyAccessTokenExpiration"));
	let _spotifyAccessTokenExpiration: string | null =
		spotifyAccessTokenExpiration;

	const [spotifyRetryAfterDate, setSpotifyRetryAfterDate] = useState<
		string | null
	>(null);
	let _spotifyRetryAfterDate: string | null = spotifyRetryAfterDate;

	const [headerHeight, setHeaderHeight] = useState<number>(0);

	const [hasInternet, setHasInternet] = useState<boolean>(false);
	let _hasInternet = false;

	const [artistName, setArtistName] = useState<string>("");
	const [trackName, setTrackName] = useState<string>("");
	const [albumName, setAlbumName] = useState<string>("");
	const [progress, setProgress] = useState<number>(0);
	const [lyrics, setLyrics] = useState<
		Array<FormattedLyric> | null | undefined
	>(null);
	const [lyricsSource, setLyricsSource] = useState<string | null | undefined>(
		null,
	);
	const [lyricsCached, setLyricsCached] = useState<boolean>(false);

	const hexRegex = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;

	const redirectUri = makeRedirectUri({
		scheme: "synclyrics",
	});

	const discovery = {
		authorizationEndpoint: "https://accounts.spotify.com/authorize",
		tokenEndpoint: "https://accounts.spotify.com/api/token",
	};

	const [request, response, promptAsync] = useAuthRequest(
		{
			clientId: _spotifyClientID || "",
			clientSecret: _spotifyClientSecret || "",
			scopes: ["user-read-playback-state"],
			usePKCE: false,
			redirectUri,
		},
		discovery,
	);

	const spotifyAuth = btoa(`${_spotifyClientID}:${_spotifyClientSecret}`);

	useEffect(() => {
		if (
			!_spotifyClientID ||
			!_spotifyClientSecret ||
			(_spotifyAccessToken &&
				Number.parseFloat(String(_spotifyAccessTokenExpiration)) - Date.now() >
					0)
		)
			return;

		if (response?.type === "success") {
			const { code } = response.params;

			const tokenData = new URLSearchParams({
				code,
				redirect_uri: redirectUri,
				grant_type: "authorization_code",
			});

			fetch(discovery.tokenEndpoint, {
				body: tokenData.toString(),
				method: "POST",
				headers: {
					Authorization: `Basic ${spotifyAuth}`,
					"Content-type": "application/x-www-form-urlencoded",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					if (!data.access_token || !data.refresh_token) {
						console.info("L135");
						return Toast.show(
							"[NSR] Something went wrong, Please reopen the app...",
							{
								duration: Toast.durations.LONG,
							},
						);
					}

					const accessToken = data.access_token;
					const refreshToken = data.refresh_token;
					const expiresAt = Date.now() + data.expires_in * 1000;

					db.set("spotifyAccessToken", accessToken);
					db.set("spotifyRefreshToken", refreshToken);
					db.set("spotifyAccessTokenExpiration", String(expiresAt));

					setSpotifyAccessToken(accessToken);
					setSpotifyRefreshToken(refreshToken);
					setSpotifyAccessTokenExpiration(String(expiresAt));
				})
				.catch((e) => {
					console.error(e);

					console.info("L159");

					Toast.show("[NSR] Something went wrong, Please reopen the app...", {
						duration: Toast.durations.LONG,
					});
				});
		}
	}, [response]);

	useEffect(() => {
		NetInfo.fetch().then((state) => {
			setHasInternet(state.isConnected || false);
			_hasInternet = state.isConnected || false;

			setTrackName("");
			setArtistName("");
			setAlbumName("");
			setProgress(0);
		});

		const unsubscribe = NetInfo.addEventListener((state) => {
			setHasInternet(state.isConnected || false);
			_hasInternet = state.isConnected || false;

			setTrackName("");
			setArtistName("");
			setAlbumName("");
			setProgress(0);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const LyricsManager = new SyncLyrics({
		instrumentalLyricsIndicator: instrumentalLyricIndicator,
		sources: ["musixmatch", "lrclib", "netease"],
		saveMusixmatchToken: (tokenData: TokenData): void => {
			db.set("musixmatchToken", JSON.stringify(tokenData));
		},
		getMusixmatchToken: () => {
			const dbTokenData = db.get("musixmatchToken");

			if (!dbTokenData) return;

			try {
				const tokenData = JSON.parse(dbTokenData);

				return tokenData;
			} catch (e) {
				return;
			}
		},
	});

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!_hasInternet) return;

			if (
				_spotifyRetryAfterDate &&
				Number.parseFloat(_spotifyRetryAfterDate) - Date.now() >= 0
			)
				return;

			if (!_spotifyAccessToken && !_spotifyRefreshToken) return;

			if (
				_spotifyRefreshToken &&
				(!_spotifyAccessTokenExpiration ||
					Number.parseFloat(_spotifyAccessTokenExpiration) - Date.now() <=
						30000 ||
					!_spotifyAccessToken)
			) {
				if (!_spotifyClientID || !_spotifyClientSecret) return;

				console.log("refresh");
				const newTokenData = await refreshAccessToken(_spotifyRefreshToken);

				if (!newTokenData) {
					_spotifyAccessToken = null;
					_spotifyRefreshToken = null;
					_spotifyAccessTokenExpiration = null;

					console.info("L250");

					return Toast.show(
						"[NSR] Something went wrong, Please reopen the app...",
						{
							duration: Toast.durations.LONG,
						},
					);
				}

				if (newTokenData.refreshToken) {
					_spotifyRefreshToken = newTokenData.refreshToken;
					db.set("spotifyRefreshToken", newTokenData.refreshToken);
					setSpotifyRefreshToken(newTokenData.refreshToken);
				}

				_spotifyAccessToken = newTokenData.accessToken;
				_spotifyAccessTokenExpiration = String(newTokenData.expiresAt);

				db.set("spotifyAccessToken", newTokenData.accessToken);
				db.set("spotifyAccessTokenExpiration", String(newTokenData.expiresAt));

				setSpotifyAccessToken(newTokenData.accessToken);
				setSpotifyAccessTokenExpiration(String(newTokenData.expiresAt));
			}

			try {
				const res = await fetch("https://api.spotify.com/v1/me/player", {
					headers: {
						Authorization: `Bearer ${_spotifyAccessToken}`,
					},
				});

				if (!res.ok) {
					if (res.status === 401) {
						if (!_spotifyRefreshToken) {
							_spotifyAccessToken = null;
							_spotifyAccessTokenExpiration = null;

							db.set("spotifyAccessToken", "");
							db.set("spotifyAccessTokenExpiration", "");

							setSpotifyAccessToken("");
							setSpotifyAccessTokenExpiration("");

							console.info("L297");

							return Toast.show(
								"[SR] Something went wrong, Please reopen the app...",
								{
									duration: Toast.durations.LONG,
								},
							);
						}

						const newTokenData = await refreshAccessToken(_spotifyRefreshToken);

						if (!newTokenData) {
							_spotifyAccessToken = null;
							_spotifyRefreshToken = null;
							_spotifyAccessTokenExpiration = null;

							console.info("L314");

							return Toast.show(
								"[NSR] Something went wrong, Please reopen the app...",
								{
									duration: Toast.durations.LONG,
								},
							);
						}

						if (newTokenData.refreshToken) {
							_spotifyRefreshToken = newTokenData.refreshToken;
							db.set("spotifyRefreshToken", newTokenData.refreshToken);
							setSpotifyRefreshToken(newTokenData.refreshToken);
						}

						console.log(newTokenData.expiresAt);

						_spotifyAccessToken = newTokenData.accessToken;
						_spotifyAccessTokenExpiration = String(newTokenData.expiresAt);

						db.set("spotifyAccessToken", newTokenData.accessToken);
						db.set(
							"spotifyAccessTokenExpiration",
							String(newTokenData.expiresAt),
						);

						setSpotifyAccessToken(newTokenData.accessToken);
						setSpotifyAccessTokenExpiration(String(newTokenData.expiresAt));
					} else if (res.status === 429) {
						const retryAfter = res.headers.get("Retry-After");

						if (!retryAfter) {
							console.info("L347");

							return Toast.show(
								"Something went wrong, Please reopen the app...",
								{
									duration: Toast.durations.LONG,
								},
							);
						}

						const retryAfterDate = String(
							Date.now() + Number.parseFloat(retryAfter) * 1000,
						);

						_spotifyRetryAfterDate = retryAfterDate;
						setSpotifyRetryAfterDate(retryAfterDate);
						db.set("spotifyRetryAfter", retryAfterDate);

						return Toast.show(
							`The App is being ratelimited, please retry in ${retryAfter} seconds...`,
							{
								duration: Toast.durations.LONG,
							},
						);
					} else {
						console.info("L372");

						return Toast.show(
							"Something went wrong, Please reopen the app...",
							{
								duration: Toast.durations.LONG,
							},
						);
					}
				}

				if (res.status === 204) return;

				const data = await res.json();

				const track = data?.item?.name;
				const album = data?.item?.album?.name;
				const progress = data?.progress_ms;
				const duration = data?.item?.duration_ms;
				const artists = data?.item?.artists
					?.map((artist: SpotifyArtist) => artist?.name)
					?.filter(Boolean);

				if (
					(!track && !album && !artists) ||
					!progress ||
					!Array.isArray(artists) ||
					artists.length <= 0
				)
					return;

				setTrackName(track);
				setArtistName(artists.join(", "));
				setAlbumName(album);
				setProgress(progress);

				const lyrics = await LyricsManager.getLyrics({
					track,
					album,
					length: duration,
					artist: artists.join(", "),
					lyricsType: ["lineSynced"],
				});

				setLyricsSource(lyrics.lyrics.lineSynced.source);
				setLyricsCached(lyrics.cached);
				setLyrics(lyrics.lyrics.lineSynced.parse());
			} catch (e) {
				console.error(e);

				console.info("L418");

				return Toast.show("Something went wrong, Please reopen the app...", {
					duration: Toast.durations.LONG,
				});
			}
		}, 500);

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		setHideSpotifyClientID(true);
		setHideSpotifyClientSecret(true);

		setSettingsInstrumentalLyricIndicator(instrumentalLyricIndicator);
		setSettingsSpotifyClientSecret(spotifyClientSecret);
		setSettingsPreviousLyricsColor(previousLyricsColor);
		setSettingsCurrentLyricColor(currentLyricColor);
		setSettingsNextLyricsColor(nextLyricsColor);
		setSettingsSpotifyClientID(spotifyClientID);
		setSettingsBackgroundColor(backgroundColor);
		setSettingsLyricsFontSize(lyricsFontSize);
		setSettingsHeaderColor(headerColor);
	}, [
		instrumentalLyricIndicator,
		spotifyClientSecret,
		previousLyricsColor,
		currentLyricColor,
		nextLyricsColor,
		spotifyClientID,
		backgroundColor,
		lyricsFontSize,
		showSettings,
		headerColor,
	]);

	const styles = getStyles({
		backgroundColor,
		headerHeight
	})

	return (
		<ClickOutsideProvider>
			<RootSiblingParent>
				<StatusBar hidden={true} />
				<View style={styles.container}>
					<Header
						lyrics={lyrics}
						trackName={trackName}
						albumName={albumName}
						artistName={artistName}
						headerColor={headerColor}
						lyricsCached={lyricsCached}
						lyricsSource={lyricsSource}
						spotifyClientID={spotifyClientID}
						setHeaderHeight={setHeaderHeight}
						spotifyClientSecret={spotifyClientSecret}
						onSettingsPress={() => setShowSettings(true)}
					/>

					{spotifyClientID && spotifyClientSecret ? (
						<View>
							{hasInternet ? (
								<LyricsContainer
									spotifyAccessTokenExpiration={spotifyAccessTokenExpiration}
									spotifyAccessToken={spotifyAccessToken}
									previousLyricsColor={previousLyricsColor}
									currentLyricColor={currentLyricColor}
									nextLyricsColor={nextLyricsColor}
									lyricsFontSize={lyricsFontSize}
									headerHeight={headerHeight}
									promptAsync={promptAsync}
									progress={progress}
									lyrics={lyrics}
								/>
							) : (
								<View style={styles.noInternetContainer}>
									<Text style={styles.noInternetText}>
										Please check your internet connection
									</Text>
								</View>
							)}
						</View>
					) : (
						<View style={styles.mainContent}>
							<Text style={styles.spotifySettingsText}>
								Please add your Spotify Client ID and Client Secret through the
								settings.{"\n"}Get them by creating an app on the{" "}
								<Link
									style={styles.spotifySettingsTextLink}
									href={"https://developer.spotify.com/dashboard"}
								>
									Spotify Developer Dashboard
								</Link>
								.
							</Text>
						</View>
					)}

					<SettingsModal
						isVisible={showSettings}
						onClose={() => setShowSettings(false)}
						closeSettingsRef={closeSettingsRef}
					>
						<View style={styles.modalContent}>
							<View style={styles.infoInputTitleContainer}>
								<Text style={styles.inputTitle}>
									Instrumental Lyric Indicator:
								</Text>
								<Tooltip
									isVisible={instrumentalLyricIndicatorTooltipVisible}
									content={<Text>Restart Required</Text>}
									placement="top"
									backgroundStyle={styles.infoTooltipBackground}
									contentStyle={styles.infoTooltip}
									onClose={() =>
										setInstrumentalLyricIndicatorTooltipVisible(false)
									}
								>
									<Pressable
										style={styles.infoToggle}
										onPress={() =>
											setInstrumentalLyricIndicatorTooltipVisible(true)
										}
									>
										<MaterialIcons
											name="warning-amber"
											color="#bf9600"
											size={18}
										/>
									</Pressable>
								</Tooltip>
							</View>
							<TextInput
								style={styles.textInput}
								value={settingsInstrumentalLyricIndicator}
								onChangeText={(content) => {
									setSettingsInstrumentalLyricIndicator(content);
								}}
								placeholder=""
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Lyrics Font Size:</Text>
							<TextInput
								style={styles.textInput}
								value={settingsLyricsFontSize}
								keyboardType="numeric"
								onChangeText={(content) => {
									setSettingsLyricsFontSize(content);
								}}
								placeholder="20"
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Current Lyric Color:</Text>
							<TextInput
								style={styles.textInput}
								value={settingsCurrentLyricColor}
								onChangeText={(content) => {
									setSettingsCurrentLyricColor(content);
								}}
								placeholder="#1ed760"
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Previous Lyrics Color:</Text>
							<TextInput
								style={styles.textInput}
								value={settingsPreviousLyricsColor}
								onChangeText={(content) => {
									setSettingsPreviousLyricsColor(content);
								}}
								placeholder="#302f2f"
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Next Lyrics Color:</Text>
							<TextInput
								style={styles.textInput}
								value={settingsNextLyricsColor}
								onChangeText={(content) => {
									setSettingsNextLyricsColor(content);
								}}
								placeholder="#fff"
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Background Color:</Text>
							<TextInput
								style={styles.textInput}
								value={settingsBackgroundColor}
								onChangeText={(content) => {
									setSettingsBackgroundColor(content);
								}}
								placeholder="#121212"
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Header Color:</Text>
							<TextInput
								style={styles.textInput}
								value={settingsHeaderColor}
								onChangeText={(content) => {
									setSettingsHeaderColor(content);
								}}
								placeholder="#1a1d21"
								placeholderTextColor="#aaa"
							/>

							<Text style={styles.inputTitle}>Spotify Client ID:</Text>
							<View style={styles.inputContainer}>
								<TextInput
									secureTextEntry={hideSpotifyClientID}
									style={styles.passwordInput}
									value={settingsSpotifyClientID || ""}
									onChangeText={(content) => {
										setSettingsSpotifyClientID(
											content.length > 0 ? content : null,
										);
									}}
									placeholder="Type here..."
									placeholderTextColor="#aaa"
								/>
								<Pressable
									style={styles.hidePasswordToggle}
									onPress={() => {
										setHideSpotifyClientID(!hideSpotifyClientID);
									}}
								>
									<MaterialIcons
										name="remove-red-eye"
										color="#8f8f8f"
										size={22}
									/>
								</Pressable>
							</View>

							<Text style={styles.inputTitle}>Spotify Client Secret:</Text>
							<View style={styles.inputContainer}>
								<TextInput
									secureTextEntry={hideSpotifyClientSecret}
									style={styles.passwordInput}
									value={settingsSpotifyClientSecret || ""}
									onChangeText={(content) => {
										setSettingsSpotifyClientSecret(content);
									}}
									placeholder="Type here..."
									placeholderTextColor="#aaa"
								/>
								<Pressable
									style={styles.hidePasswordToggle}
									onPress={() => {
										setHideSpotifyClientSecret(!hideSpotifyClientSecret);
									}}
								>
									<MaterialIcons
										name="remove-red-eye"
										color="#8f8f8f"
										size={22}
									/>
								</Pressable>
							</View>

							<Pressable
								style={styles.saveButton}
								onPress={saveSettings}
							>
								<Text>Save</Text>
							</Pressable>
						</View>
					</SettingsModal>
				</View>
			</RootSiblingParent>
		</ClickOutsideProvider>
	);

	function saveSettings() {
		if (
			!Number.parseFloat(settingsLyricsFontSize) ||
			Number.parseFloat(settingsLyricsFontSize) <= 0
		) {
			Alert.alert(
				"Invalid Settings",
				"Lyrics Font size must be a number greater than 0.\nIt has been reset to 20",
			);

			setSettingsLyricsFontSize("20");
			setLyricsFontSize("20");
			db.set("lyricsFontSize", "20");
		} else {
			setLyricsFontSize(settingsLyricsFontSize || "20");
			db.set("lyricsFontSize", settingsLyricsFontSize || "20");
		}

		if (!hexRegex.test(settingsCurrentLyricColor)) {
			Alert.alert(
				"Invalid Settings",
				"Current Lyric Color must be a hexadecimal color.\nIt has been reset to #1ed760",
			);

			setSettingsCurrentLyricColor("#1ed760");
			setCurrentLyricColor("#1ed760");
			db.set("currentLyricColor", "#1ed760");
		} else {
			setCurrentLyricColor(
				settingsCurrentLyricColor || "#1ed760",
			);
			db.set(
				"currentLyricColor",
				settingsCurrentLyricColor || "#1ed760",
			);
		}

		if (!hexRegex.test(settingsPreviousLyricsColor)) {
			Alert.alert(
				"Invalid Settings",
				"Previous Lyrics Color must be a hexadecimal color.\nIt has been reset to #302f2f",
			);

			setSettingsPreviousLyricsColor("#302f2f");
			setPreviousLyricsColor("#302f2f");
			db.set("previousLyricsColor", "#302f2f");
		} else {
			setPreviousLyricsColor(
				settingsPreviousLyricsColor || "#302f2f",
			);
			db.set(
				"previousLyricsColor",
				settingsPreviousLyricsColor || "#302f2f",
			);
		}

		if (!hexRegex.test(settingsNextLyricsColor)) {
			Alert.alert(
				"Invalid Settings",
				"Next Lyrics Color must be a hexadecimal color.\nIt has been reset to #fff",
			);

			setSettingsNextLyricsColor("#fff");
			setNextLyricsColor("#fff");
			db.set("nextLyricsColor", "#fff");
		} else {
			setNextLyricsColor(settingsNextLyricsColor || "#fff");
			db.set(
				"nextLyricsColor",
				settingsNextLyricsColor || "#fff",
			);
		}

		if (!hexRegex.test(settingsBackgroundColor)) {
			Alert.alert(
				"Invalid Settings",
				"Background Color must be a hexadecimal color.\nIt has been reset to #121212",
			);

			setSettingsBackgroundColor("#121212");
			setBackgroundColor("#121212");
			db.set("backgroundColor", "#121212");
		} else {
			setBackgroundColor(settingsBackgroundColor || "#121212");
			db.set(
				"backgroundColor",
				settingsBackgroundColor || "#121212",
			);
		}

		if (!hexRegex.test(settingsHeaderColor)) {
			Alert.alert(
				"Invalid Settings",
				"Header Color must be a hexadecimal color.\nIt has been reset to #302f2f",
			);

			setSettingsHeaderColor("#302f2f");
			setHeaderColor("#302f2f");
			db.set("headerColor", "#302f2f");
		} else {
			setHeaderColor(settingsHeaderColor || "#121212");
			db.set("headerColor", settingsHeaderColor || "#121212");
		}

		setInstrumentalLyricIndicator(
			settingsInstrumentalLyricIndicator,
		);
		db.set(
			"instrumentalLyricIndicator",
			settingsInstrumentalLyricIndicator,
		);

		setSpotifyClientID(settingsSpotifyClientID || "");
		_spotifyClientID = settingsSpotifyClientID || "";
		db.set("spotifyClientID", settingsSpotifyClientID || "");

		setSpotifyClientSecret(settingsSpotifyClientSecret || "");
		_spotifyClientSecret = settingsSpotifyClientSecret || "";
		db.set(
			"spotifyClientSecret",
			settingsSpotifyClientSecret || "",
		);

		setShowSettings(false);
	}

	async function refreshAccessToken(_refreshToken: string): Promise<null | {
		accessToken: string;
		expiresAt: number;
		refreshToken: string | null | undefined;
	}> {
		if (!_spotifyClientID || !_spotifyClientSecret) return null;

		try {
			const refreshBody = new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: _refreshToken,
			});

			const res = await fetch(discovery.tokenEndpoint, {
				body: refreshBody.toString(),
				method: "POST",
				headers: {
					Authorization: `Basic ${spotifyAuth}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});

			if (!res.ok) return null;

			const data = await res.json();

			const accessToken = data.access_token;
			const refreshToken = data.refresh_token;
			const expiresAt = Date.now() + data.expires_in * 1000;

			return {
				accessToken,
				refreshToken,
				expiresAt,
			};
		} catch (e) {
			console.error(e);

			console.info("L559");

			Toast.show("Something went wrong, Please reopen the app...", {
				duration: Toast.durations.LONG,
			});

			return null;
		}
	}
}
