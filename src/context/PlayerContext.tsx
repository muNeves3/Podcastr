import { createContext, ReactNode, useState } from "react"

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Array<Episode>
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episode: Episode) => void
  togglePlay: () => void
  setIsPlayingState: (state: boolean) => void
  playList: (list: Array<Episode>, index: number) => void
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Array<Episode>, index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function setIsPlayingState(state: boolean) {
    setIsPlaying(state)
  }
  return (
    <PlayerContext.Provider
      value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setIsPlayingState, playList }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
