import React, { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { fetchPrivateVideos } from "./vimeo.js";
import PrivateVimeoPlayer from "./privateVimeoPlayer.jsx";
const VimeoPlayer = ({ videoId }) => {
  const playerRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const data = await fetchPrivateVideos(videoId);
        console.log("data", data.embed.html);
        setVideoData(data || "no data");
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };
    loadVideo();
  }, [videoId]);
  // console.log(nigga.embed.html);
  useEffect(() => {
    if (!videoData || playerRef.current) return;
    const player = new Player(playerRef.current, {
      url: videoData,
      width: 200,
      autoplay: false,
    });
    player.on("play", () => console.log("video played"));
    player.on("pause", () => console.log("video paused"));
    return () => player.destroy();
  }, [videoData]);
  return (
    <>
      {!videoData && <p>Loading lecture video</p>}
      <div ref={playerRef}></div>

      <PrivateVimeoPlayer embedHtml={videoData?.embed.html} />
    </>
  );
};

export default VimeoPlayer;
const nigga = {
  uri: "/videos/1133826454",
  name: "test private",
  description: null,
  type: "video",
  link: "https://vimeo.com/1133826454",
  player_embed_url: "https://player.vimeo.com/video/1133826454?h=4fe70fea59",
  duration: 16,
  width: 1920,
  language: null,
  height: 1080,
  embed: {
    html: '<iframe src="https://player.vimeo.com/video/1133826454?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=510943" width="1920" height="1080" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" title="test private"></iframe>',
    badges: {
      hdr: false,
      live: {
        streaming: false,
        archived: false,
      },
      staff_pick: {
        normal: false,
        best_of_the_month: false,
        best_of_the_year: false,
        premiere: false,
      },
      vod: false,
      weekend_challenge: false,
    },
    interactive: false,
    buttons: {
      watchlater: true,
      share: true,
      embed: true,
      hd: false,
      fullscreen: true,
      scaling: true,
      like: true,
    },
    logos: {
      vimeo: true,
      custom: {
        active: false,
        url: null,
        link: null,
        use_link: false,
        sticky: false,
      },
    },
    play_button: {
      position: "auto",
    },
    title: {
      name: "show",
      owner: "show",
      portrait: "show",
    },
    end_screen: [],
    playbar: true,
    quality_selector: null,
    pip: true,
    autopip: true,
    volume: true,
    color: "00adef",
    colors: {
      color_one: "000000",
      color_two: "00adef",
      color_three: "ffffff",
      color_four: "000000",
    },
    event_schedule: true,
    has_cards: false,
    outro_type: "videos",
    show_timezone: false,
    cards: [],
    airplay: true,
    audio_tracks: true,
    chapters: true,
    chromecast: true,
    closed_captions: true,
    transcript: true,
    skipping_forward: true,
    ask_ai: false,
    uri: null,
    email_capture_form: [],
    speed: true,
  },
  created_time: "2025-11-05T13:29:37+00:00",
  modified_time: "2025-11-05T13:31:56+00:00",
  release_time: "2025-11-05T13:29:37+00:00",
  content_rating: ["unrated"],
  content_rating_class: "unrated",
  rating_mod_locked: false,
  license: null,
  privacy: {
    view: "nobody",
    embed: "whitelist",
    download: false,
    add: false,
    comments: "nobody",
  },
  pictures: {
    uri: "/videos/1133826454/pictures/2078555799",
    active: true,
    type: "custom",
    base_link:
      "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d?region=us",
    sizes: [
      {
        width: 100,
        height: 75,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_100x75?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_100x75%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
      {
        width: 200,
        height: 150,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_200x150?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_200x150%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
      {
        width: 295,
        height: 166,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_295x166?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_295x166%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
      {
        width: 640,
        height: 360,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_640x360?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_640x360%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
      {
        width: 960,
        height: 540,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_960x540?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_960x540%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
      {
        width: 1280,
        height: 720,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_1280x720?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_1280x720%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
      {
        width: 1920,
        height: 1080,
        link: "https://i.vimeocdn.com/video/2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_1920x1080?&r=pad&region=us",
        link_with_play_button:
          "https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F2078555799-d0fb17a80eae9d13b7a27d1b402797d5c451dd792630076f26d6342ab9c6918b-d_1920x1080%3F%26region%3Dus&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png",
      },
    ],
    resource_key: "33d8d669390964e6202966d335b9f1cee3bf6170",
    default_picture: false,
  },
  tags: [],
  stats: {
    plays: 0,
  },
  categories: [],
  uploader: {
    pictures: {
      uri: "/users/228825144/pictures/105205515",
      active: true,
      type: "custom",
      base_link:
        "https://i.vimeocdn.com/portrait/105205515?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
      sizes: [
        {
          width: 30,
          height: 30,
          link: "https://i.vimeocdn.com/portrait/105205515_30x30?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 72,
          height: 72,
          link: "https://i.vimeocdn.com/portrait/105205515_72x72?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 75,
          height: 75,
          link: "https://i.vimeocdn.com/portrait/105205515_75x75?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 100,
          height: 100,
          link: "https://i.vimeocdn.com/portrait/105205515_100x100?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 144,
          height: 144,
          link: "https://i.vimeocdn.com/portrait/105205515_144x144?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 216,
          height: 216,
          link: "https://i.vimeocdn.com/portrait/105205515_216x216?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 288,
          height: 288,
          link: "https://i.vimeocdn.com/portrait/105205515_288x288?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 300,
          height: 300,
          link: "https://i.vimeocdn.com/portrait/105205515_300x300?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 360,
          height: 360,
          link: "https://i.vimeocdn.com/portrait/105205515_360x360?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
      ],
      resource_key: "8dac30ed4f99439c20dd95e69be96ba8d72e1f17",
      default_picture: false,
    },
  },
  metadata: {
    connections: {
      comments: {
        uri: "/videos/1133826454/comments",
        options: ["GET", "POST"],
        total: 0,
      },
      credits: {
        uri: "/videos/1133826454/credits",
        options: ["GET", "POST"],
        total: 0,
      },
      likes: {
        uri: "/videos/1133826454/likes",
        options: ["GET"],
        total: 0,
      },
      pictures: {
        uri: "/videos/1133826454/pictures",
        options: ["GET", "POST"],
        total: 1,
      },
      texttracks: {
        uri: "/videos/1133826454/texttracks",
        options: ["GET", "POST"],
        total: 1,
      },
      related: null,
      recommendations: {
        uri: "/videos/1133826454/recommendations",
        options: ["GET"],
        resource_signature:
          "acb9adbb427457bce278b4fb4a69feaeb3c01da94408165600f3193718216b09_1762419600",
      },
      albums: {
        uri: "/videos/1133826454/albums",
        options: ["GET", "PATCH"],
        total: 0,
      },
      available_albums: {
        uri: "/videos/1133826454/available_albums",
        options: ["GET"],
        total: 1,
      },
      available_channels: {
        uri: "/videos/1133826454/available_channels",
        options: ["GET"],
        total: 0,
      },
      versions: {
        uri: "/videos/1133826454/versions",
        options: ["GET"],
        total: 1,
        current_uri: "/videos/1133826454/versions/1132026672",
        resource_key: "7826eab50b28b5418d46bd19169e12fa2e08db23",
        create_storyboard_id: "",
        latest_incomplete_version: null,
      },
    },
    interactions: {
      watchlater: {
        uri: "/users/228825144/watchlater/1133826454",
        options: ["GET", "PUT", "DELETE"],
        added: false,
        added_time: null,
      },
      report: {
        uri: "/videos/1133826454/report",
        options: ["POST"],
        reason: [
          "pornographic",
          "harassment",
          "ripoff",
          "incorrect rating",
          "spam",
          "causes harm",
          "csam",
          "voting misinformation",
        ],
      },
      view_team_members: {
        uri: "/videos/1133826454/teammembers",
        options: ["GET"],
      },
      edit: {
        uri: "/videos/1133826454",
        options: ["PATCH"],
        blocked_fields: [],
      },
      edit_content_rating: {
        uri: "/videos/1133826454",
        options: ["PATCH"],
        content_rating: [
          "language",
          "drugs",
          "violence",
          "nudity",
          "advertisement",
          "safe",
          "unrated",
        ],
      },
      edit_privacy: {
        uri: "/videos/1133826454",
        options: ["PATCH"],
        content_type: "application/vnd.vimeo.video",
        properties: [
          {
            name: "privacy.view",
            required: true,
            options: [
              "anybody",
              "nobody",
              "team",
              "password",
              "disable",
              "unlisted",
            ],
          },
        ],
      },
      delete: {
        uri: "/videos/1133826454",
        options: ["DELETE"],
      },
      can_update_privacy_to_public: {
        uri: "/videos/1133826454",
        options: ["PATCH"],
      },
      invite: {
        uri: "/users/228825144/team_user_clip_access_grants",
        options: ["GET", "POST"],
      },
      trim: {
        uri: "/videos/1133826454/cliptrim",
        options: ["GET", "POST"],
      },
      validate: {
        uri: "/videos/1133826454/validate",
        options: ["PUT"],
      },
    },
    is_vimeo_create: false,
    is_screen_record: false,
  },
  manage_link: "/manage/videos/1133826454",
  user: {
    uri: "/users/228825144",
    name: "Enayatullah Mudaris",
    link: "https://vimeo.com/user228825144",
    capabilities: {
      hasLiveSubscription: false,
    },
    location: "",
    gender: "",
    bio: null,
    short_bio: null,
    created_time: "2024-10-16T15:02:12+00:00",
    pictures: {
      uri: "/users/228825144/pictures/105205515",
      active: true,
      type: "custom",
      base_link:
        "https://i.vimeocdn.com/portrait/105205515?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
      sizes: [
        {
          width: 30,
          height: 30,
          link: "https://i.vimeocdn.com/portrait/105205515_30x30?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 72,
          height: 72,
          link: "https://i.vimeocdn.com/portrait/105205515_72x72?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 75,
          height: 75,
          link: "https://i.vimeocdn.com/portrait/105205515_75x75?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 100,
          height: 100,
          link: "https://i.vimeocdn.com/portrait/105205515_100x100?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 144,
          height: 144,
          link: "https://i.vimeocdn.com/portrait/105205515_144x144?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 216,
          height: 216,
          link: "https://i.vimeocdn.com/portrait/105205515_216x216?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 288,
          height: 288,
          link: "https://i.vimeocdn.com/portrait/105205515_288x288?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 300,
          height: 300,
          link: "https://i.vimeocdn.com/portrait/105205515_300x300?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
        {
          width: 360,
          height: 360,
          link: "https://i.vimeocdn.com/portrait/105205515_360x360?sig=1f8d60f11ba2d875ed18872737e8e3972ab1ceea89a70cd090eba8a12dab9411&v=1&region=us",
        },
      ],
      resource_key: "8dac30ed4f99439c20dd95e69be96ba8d72e1f17",
      default_picture: false,
    },
    websites: [],
    metadata: {
      connections: {
        albums: {
          uri: "/users/228825144/albums",
          options: ["GET"],
          total: 1,
        },
        appearances: {
          uri: "/users/228825144/appearances",
          options: ["GET"],
          total: 0,
        },
        categories: {
          uri: "/users/228825144/categories",
          options: ["GET"],
          total: 0,
        },
        channels: {
          uri: "/users/228825144/channels",
          options: ["GET"],
          total: 0,
        },
        feed: {
          uri: "/users/228825144/feed",
          options: ["GET"],
        },
        followers: {
          uri: "/users/228825144/followers",
          options: ["GET"],
          total: 0,
        },
        following: {
          uri: "/users/228825144/following",
          options: ["GET"],
          total: 0,
        },
        groups: {
          uri: "/users/228825144/groups",
          options: ["GET"],
          total: 0,
        },
        likes: {
          uri: "/users/228825144/likes",
          options: ["GET"],
          total: 0,
        },
        membership: {
          uri: "/users/228825144/membership/",
          options: ["PATCH"],
        },
        moderated_channels: {
          uri: "/users/228825144/channels?filter=moderated",
          options: ["GET"],
          total: 0,
        },
        portfolios: {
          uri: "/users/228825144/portfolios",
          options: ["GET"],
          total: 0,
        },
        videos: {
          uri: "/users/228825144/videos",
          options: ["GET"],
          total: 1,
        },
        watchlater: {
          uri: "/users/228825144/watchlater",
          options: ["GET"],
          total: 0,
        },
        shared: {
          uri: "/users/228825144/shared/videos",
          options: ["GET"],
          total: 0,
        },
        pictures: {
          uri: "/users/228825144/pictures",
          options: ["GET", "POST"],
          total: 1,
        },
        watched_videos: {
          uri: "/me/watched/videos",
          options: ["GET"],
          total: 0,
        },
        folders_root: {
          uri: "/users/228825144/folders/root",
          options: ["GET"],
        },
        folders: {
          uri: "/users/228825144/folders",
          options: ["GET", "POST"],
          total: 6,
        },
        teams: {
          uri: "/users/228825144/teams",
          options: ["GET"],
          total: 1,
        },
        permission_policies: {
          uri: "/users/228825144/permission_policies",
          options: ["GET"],
          total: 13,
        },
        block: {
          uri: "/me/block",
          options: ["GET"],
          total: 0,
        },
      },
    },
    location_details: {
      formatted_address: "",
      latitude: null,
      longitude: null,
      city: null,
      state: null,
      neighborhood: null,
      sub_locality: null,
      state_iso_code: null,
      country: null,
      country_iso_code: null,
    },
    skills: [],
    available_for_hire: false,
    can_work_remotely: false,
    preferences: {
      videos: {
        rating: ["unrated"],
        autocc_display_enabled_by_default: false,
        license: null,
        hide_stats: true,
        privacy: {
          view: "anybody",
          comments: "nobody",
          embed: "public",
          download: false,
          add: false,
          allow_share_link: true,
        },
      },
      webinar_registrant_lower_watermark_banner_dismissed: [],
    },
    content_filter: [
      "language",
      "drugs",
      "violence",
      "nudity",
      "safe",
      "unrated",
    ],
    upload_quota: {
      space: {
        free: 2198991788663,
        max: 2199023255552,
        used: 31466889,
        showing: "lifetime",
        unit: "video_size",
      },
      periodic: {
        period: null,
        unit: null,
        free: null,
        max: null,
        used: null,
        reset_date: null,
      },
      lifetime: {
        unit: "video_size",
        free: 2198991788663,
        max: 2199023255552,
        used: 31466889,
      },
    },
    resource_key: "959740cfdb5aaba664ee6c0b6bcea221bd03d9c4",
    account: "standard",
  },
  last_user_action_event_date: "2025-11-05T13:31:02+00:00",
  parent_folder: null,
  review_page: {
    active: false,
    link: "https://vimeo.com/user228825144/review/1133826454/5867f0bbde",
    is_shareable: true,
  },
  files: [
    {
      quality: "hd",
      rendition: "1080p",
      type: "video/mp4",
      width: 1920,
      height: 1080,
      link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&oauth2_token_id=1802919033&signature=d0a21b575aae3abd4bdbb3b1f4aa98eb2cccffe33d51a541edadef164e41b25c",
      created_time: "2025-11-05T13:31:55+00:00",
      fps: 29.97002997002997,
      size: 11993617,
      md5: null,
      public_name: "1080p",
      size_short: "11.44MB",
    },
    {
      quality: "hd",
      rendition: "720p",
      type: "video/mp4",
      width: 1280,
      height: 720,
      link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&oauth2_token_id=1802919033&signature=5398fe47ab194cbb31667ff8cef9500c0ea3a7ec205d808e62067c2b8be7f256",
      created_time: "2025-11-05T13:31:31+00:00",
      fps: 29.97002997002997,
      size: 4649240,
      md5: null,
      public_name: "720p",
      size_short: "4.43MB",
    },
    {
      quality: "sd",
      rendition: "540p",
      type: "video/mp4",
      width: 960,
      height: 540,
      link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/rendition/540p/file.mp4%20%28540p%29.mp4?loc=external&oauth2_token_id=1802919033&signature=f1b21d846651b35a6172fe2bd3a4e47c004e0b95606a4ab4d78d87da8ee345b3",
      created_time: "2025-11-05T13:31:36+00:00",
      fps: 29.97002997002997,
      size: 2725437,
      md5: null,
      public_name: "540p",
      size_short: "2.6MB",
    },
    {
      quality: "sd",
      rendition: "360p",
      type: "video/mp4",
      width: 640,
      height: 360,
      link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/rendition/360p/file.mp4%20%28360p%29.mp4?loc=external&oauth2_token_id=1802919033&signature=6fec8ef1c0a7d6866189823136ef5b873da524a54036fd0911a295a76f898278",
      created_time: "2025-11-05T13:31:34+00:00",
      fps: 29.97002997002997,
      size: 1459050,
      md5: null,
      public_name: "360p",
      size_short: "1.39MB",
    },
    {
      quality: "sd",
      rendition: "240p",
      type: "video/mp4",
      width: 426,
      height: 240,
      link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/rendition/240p/file.mp4%20%28240p%29.mp4?loc=external&oauth2_token_id=1802919033&signature=5a3d80929fdfdeb41283b8430f162a9da0ddb4eb9d41e15615e79a8840c2662b",
      created_time: "2025-11-05T13:31:54+00:00",
      fps: 29.97002997002997,
      size: 966785,
      md5: null,
      public_name: "240p",
      size_short: "944.13KB",
    },
    {
      quality: "hls",
      rendition: "adaptive",
      type: "video/mp4",
      link: "https://player.vimeo.com/external/1133826454.m3u8?s=65582ddf8f3700a03f0c764236665effa1be9875&oauth2_token_id=1802919033",
      created_time: "2025-11-05T13:31:55+00:00",
      fps: 29.97002997002997,
      size: 11993617,
      md5: null,
      public_name: "1080p",
      size_short: "11.44MB",
    },
  ],
  download: [
    {
      quality: "sd",
      rendition: "360p",
      type: "video/mp4",
      width: 640,
      height: 360,
      expires: "2025-11-07T08:55:01+00:00",
      link: "https://player.vimeo.com/progressive_redirect/download/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/b2aec3a3-e03b2791/test_private%20%28360p%29.mp4?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=70655041545a1e573218e441f3a472e8a439141fad4f9d2cb6c3f46e346a957d&user_id=228825144",
      created_time: "2025-11-05T13:31:34+00:00",
      fps: 29.97002997002997,
      size: 1459050,
      md5: null,
      public_name: "360p",
      size_short: "1.39MB",
    },
    {
      quality: "hd",
      rendition: "720p",
      type: "video/mp4",
      width: 1280,
      height: 720,
      expires: "2025-11-07T08:55:01+00:00",
      link: "https://player.vimeo.com/progressive_redirect/download/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/cc5237a5-e03b2791/test_private%20%28720p%29.mp4?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=a99f0e5743e8211b29d00d9b2b2fa9ef1dac654006a9988625238111f8cf5290&user_id=228825144",
      created_time: "2025-11-05T13:31:31+00:00",
      fps: 29.97002997002997,
      size: 4649240,
      md5: null,
      public_name: "720p",
      size_short: "4.43MB",
    },
    {
      quality: "hd",
      rendition: "1080p",
      type: "video/mp4",
      width: 1920,
      height: 1080,
      expires: "2025-11-07T08:55:01+00:00",
      link: "https://player.vimeo.com/progressive_redirect/download/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/151b8b21-e03b2791/test_private%20%281080p%29.mp4?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=6b1f4e00ae9fd6852e086aedd76ba116b5c613d9c83ac4103c249f0665731657&user_id=228825144",
      created_time: "2025-11-05T13:31:55+00:00",
      fps: 29.97002997002997,
      size: 11993617,
      md5: null,
      public_name: "1080p",
      size_short: "11.44MB",
    },
    {
      quality: "sd",
      rendition: "540p",
      type: "video/mp4",
      width: 960,
      height: 540,
      expires: "2025-11-07T08:55:01+00:00",
      link: "https://player.vimeo.com/progressive_redirect/download/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/4b6231c3-e03b2791/test_private%20%28540p%29.mp4?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=0265a71e157284a530039323df07b038cb4ce2840f10f4e8314dda05ed3474f8&user_id=228825144",
      created_time: "2025-11-05T13:31:36+00:00",
      fps: 29.97002997002997,
      size: 2725437,
      md5: null,
      public_name: "540p",
      size_short: "2.6MB",
    },
    {
      quality: "sd",
      rendition: "240p",
      type: "video/mp4",
      width: 426,
      height: 240,
      expires: "2025-11-07T08:55:01+00:00",
      link: "https://player.vimeo.com/progressive_redirect/download/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/7bb7b7db-e03b2791/test_private%20%28240p%29.mp4?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=5772d844ae8c64316a14e72fc03b50a9fdc48b56a58eaf81f01b3d25979bd82f&user_id=228825144",
      created_time: "2025-11-05T13:31:54+00:00",
      fps: 29.97002997002997,
      size: 966785,
      md5: null,
      public_name: "240p",
      size_short: "944.13KB",
    },
  ],
  app: {
    name: "Vimeo Site",
    uri: "/apps/58479",
  },
  play: {
    progressive: [
      {
        type: "video/mp4",
        codec: "H264",
        width: 1280,
        height: 720,
        link_expiration_time: "2025-11-07T08:55:01+00:00",
        link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/cc5237a5-e03b2791?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=f91b64a85859c76d51e54cf97fede6ebb11db9e4d036f0dd96abd1f6446abdd9&user_id=228825144",
        created_time: "2025-11-05T13:31:31+00:00",
        fps: 29.97002997002997,
        size: 4649240,
        md5: null,
        rendition: "720p",
      },
      {
        type: "video/mp4",
        codec: "H264",
        width: 1920,
        height: 1080,
        link_expiration_time: "2025-11-07T08:55:01+00:00",
        link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/151b8b21-e03b2791?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=6b9a7e11f5af53906047b484e0d2f641f7bde1890c84a0542ef9a13147a3d97d&user_id=228825144",
        created_time: "2025-11-05T13:31:55+00:00",
        fps: 29.97002997002997,
        size: 11993617,
        md5: null,
        rendition: "1080p",
      },
      {
        type: "video/mp4",
        codec: "H264",
        width: 960,
        height: 540,
        link_expiration_time: "2025-11-07T08:55:01+00:00",
        link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/4b6231c3-e03b2791?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=4552a2b8e60c07db4dd4b1a416123bc703273922c1a56dbc21a5bb12ec7aef99&user_id=228825144",
        created_time: "2025-11-05T13:31:36+00:00",
        fps: 29.97002997002997,
        size: 2725437,
        md5: null,
        rendition: "540p",
      },
      {
        type: "video/mp4",
        codec: "H264",
        width: 426,
        height: 240,
        link_expiration_time: "2025-11-07T08:55:01+00:00",
        link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/7bb7b7db-e03b2791?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=54278354e91a33b92bfccd51f7cc4f308532711c9b1e8e328227128ff801bcb2&user_id=228825144",
        created_time: "2025-11-05T13:31:54+00:00",
        fps: 29.97002997002997,
        size: 966785,
        md5: null,
        rendition: "240p",
      },
      {
        type: "video/mp4",
        codec: "H264",
        width: 640,
        height: 360,
        link_expiration_time: "2025-11-07T08:55:01+00:00",
        link: "https://player.vimeo.com/progressive_redirect/playback/1133826454/container/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/b2aec3a3-e03b2791?expires=1762505701&loc=external&oauth2_token_id=1802919033&signature=da2d5b4039caede89db4eaa4e5a0e68154c4a88dbf7629f0d65a207589a8aabf&user_id=228825144",
        created_time: "2025-11-05T13:31:34+00:00",
        fps: 29.97002997002997,
        size: 1459050,
        md5: null,
        rendition: "360p",
      },
    ],
    hls: {
      link_expiration_time: "2025-11-07T08:55:00+00:00",
      link: "https://player.vimeo.com/play/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/hls.m3u8?s=1133826454_1762505700_8096b3cfb9adfeae4a5e5ab12309fa6a&context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&oauth2_token_id=1802919033",
    },
    dash: {
      link_expiration_time: "2025-11-07T08:55:00+00:00",
      link: "https://player.vimeo.com/play/d0ca3e6d-c7ce-475c-a256-7a354e86c2ab/dash.mpd?s=1133826454_1762505700_8096b3cfb9adfeae4a5e5ab12309fa6a&context=Vimeo%5CController%5CApi%5CResources%5CVideoController.&oauth2_token_id=1802919033",
    },
    status: "playable",
  },
  status: "available",
  resource_key: "8a8ad216381812bbafcef64c4b050b10cc4f8047",
  upload: {
    status: "complete",
    link: null,
    upload_link: null,
    form: null,
    approach: null,
    size: null,
    redirect_url: null,
  },
  transcode: {
    status: "complete",
  },
  is_playable: true,
  has_audio: true,
};
