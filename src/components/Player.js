import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Link } from 'react-router-dom';
import './Player.css'; // Ensure to create a corresponding CSS file
import { Icon } from '@iconify/react';

function Player({ showPlaylistWindow, url }) {
    const initialPlaylist = [
        { id: 1, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name: 'Track 1', date_posted: "2024-03-04"},
        { id: 2, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name: 'Track 2', date_posted: "2024-03-03"},
        { id: 3, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', name: 'Track 3', date_posted: "2024-03-01"},
    ];

    const [playlist, setPlaylist] = useState(initialPlaylist);
    const [currentTrack, setTrackIndex] = useState(0);
    const [durations, setDurations] = useState({});
    const [sortAsc, setSortAsc] = useState(true);  // true for oldest to newest, false for newest to oldest

    useEffect(() => {
        playlist.forEach(item => {
            getAudioDuration(item.src, item.id);
        });
    }, []); // Runs once on component mount

    const handleClickNext = () => {
        setTrackIndex(currentTrack => (currentTrack < playlist.length - 1 ? currentTrack + 1 : 0));
    };
    
    const handleEnd = () => {
        handleClickNext();
    };

    const getAudioDuration = (audioUrl, id) => {
        const audio = new Audio(audioUrl);
        audio.onloadedmetadata = () => {
            setDurations(prevDurations => ({
                ...prevDurations,
                [id]: audio.duration
            }));
        };
    };

    const handleSelectAudio = (event, index) => {
        event.preventDefault();
        setTrackIndex(index);
    };

    const formatDuration = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
    };

    const handleSort = () => {
        const sorted = [...playlist].sort((a, b) => {
            return sortAsc ? new Date(a.date_posted) - new Date(b.date_posted) : new Date(b.date_posted) - new Date(a.date_posted);
        });
        setPlaylist(sorted);
        setSortAsc(!sortAsc);  // Toggle sorting order for next click
    };

    const playlistWindowClasses = showPlaylistWindow ? "player rounded-top" : "player";

    return (
        <div className='container'>
            <div className='row'>
                <div className='column'>
                    {showPlaylistWindow ? (
                        <div>
                            <AudioPlayer
                                volume={0.5}
                                src={playlist[currentTrack].src}
                                showSkipControls
                                onClickNext={handleClickNext}
                                onEnded={handleEnd}
                                onError={() => console.log('play error')}
                                className={playlistWindowClasses}
                            />
                            <div className='playlist'>
                                <ul>
                                    {playlist.map((item, index) => (
                                        <li key={item.id} className={`item${index === currentTrack ? ' active' : ''}`} onClick={(e) => handleSelectAudio(e, index)}>
                                            <Link to="#">
                                                <span className='track-name'>{item.name}</span> <span className="date-posted">{item.date_posted}</span>  {index === currentTrack ? <Icon icon="mdi:play" /> : ""} <span className='track-duration'>{durations[item.id] ? formatDuration(durations[item.id]) : 'Loading...'}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='bottom-bar'><button className='sort-button' onClick={handleSort}>Sort {sortAsc ? "Newest" : "Oldest"}</button></div>
                        </div>
                    ) : <div>
                        <AudioPlayer
                            volume={0.5}
                            src={url}
                            onError={() => console.log('play error')}
                        /></div>}
                </div>
            </div>
        </div>
    );
}

export default Player;
