import { useContext, useEffect, useRef, useState } from "react"

import Image from "next/image"
import { usePlayer } from "../../context/PlayerContext"
import styles from "./styles.module.scss"
import Slider from "rc-slider"

import "rc-slider/assets/index.css"
import { converDurationToTimeString } from "../../utils/converDurationToTimeString"

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setIsPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    toggleShuffle,
    isShuffling,
    clearPlayerState
   } = usePlayer();

  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) {
      return
    }
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime ))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.empityPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empity : ""}>
        <div className={styles.progress}>
          <span>{converDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361" }}
              />
            ) : (
              <div className={styles.empitySlider} />
            )}
          </div>
          <span>{converDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            autoPlay
            onEnded={handleEpisodeEnded}
            ref={audioRef}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
          >
            <track kind="captions" />
          </audio>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            onClick={() =>toggleShuffle()}
            className={isShuffling ? styles.isActive : ''}
            >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type="button" onClick={() => playPrevious()}  disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            <img src={isPlaying ? "/pause.svg" : "/play.svg"} alt="Tocar" />
          </button>

          <button type="button" onClick={() => playNext()} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={() =>
            toggleLoop()}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}
function clearPlayerState() {
  throw new Error("Function not implemented.")
}

