'use client'

import * as React from 'react'
import { Gamepad2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const GRAVITY = 0.55
const JUMP_FORCE = -9.5
const GROUND_OFFSET = 28
const PLAYER_W = 22
const PLAYER_H = 28

type Obstacle = { x: number; w: number; h: number; label: string }

type GameState = {
  running: boolean
  everStarted: boolean
  gameOver: boolean
  playerY: number
  playerVy: number
  obstacles: Obstacle[]
  frame: number
  score: number
  speed: number
  spawnTimer: number
  width: number
  height: number
}

export function ServerWaitGame({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [score, setScore] = React.useState(0)
  const [best, setBest] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(false)

  const stateRef = React.useRef<GameState>({
    running: false,
    everStarted: false,
    gameOver: false,
    playerY: 0,
    playerVy: 0,
    obstacles: [],
    frame: 0,
    score: 0,
    speed: 4.2,
    spawnTimer: 0,
    width: 520,
    height: 140,
  })

  React.useEffect(() => {
    setBest(Number(sessionStorage.getItem('edusync-wait-game-best') || 0))
  }, [])

  const resetGame = React.useCallback(() => {
    const s = stateRef.current
    s.playerY = 0
    s.playerVy = 0
    s.obstacles = []
    s.frame = 0
    s.score = 0
    s.speed = 4.2
    s.spawnTimer = 0
    s.gameOver = false
    s.running = true
    s.everStarted = true
    setScore(0)
    setGameOver(false)
  }, [])

  const jump = React.useCallback(() => {
    const s = stateRef.current
    if (s.gameOver || !s.running) {
      resetGame()
      return
    }
    if (s.playerY >= -1) {
      s.playerVy = JUMP_FORCE
    }
  }, [resetGame])

  React.useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const labels = ['503', 'Bug', '404', 'Lag', '500']
    let raf = 0

    const resize = () => {
      const w = Math.min(container.clientWidth, 560)
      stateRef.current.width = w
      stateRef.current.height = 140
      canvas.width = w * devicePixelRatio
      canvas.height = 140 * devicePixelRatio
      canvas.style.width = `${w}px`
      canvas.style.height = '140px'
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const drawGround = (w: number, h: number) => {
      ctx.strokeStyle = '#D1D5DB'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, h - GROUND_OFFSET)
      ctx.lineTo(w, h - GROUND_OFFSET)
      ctx.stroke()
    }

    const drawPlayer = (h: number) => {
      const s = stateRef.current
      const x = 48
      const y = h - GROUND_OFFSET - PLAYER_H + s.playerY

      ctx.fillStyle = '#6366F1'
      ctx.beginPath()
      ctx.roundRect(x, y, PLAYER_W, PLAYER_H, 6)
      ctx.fill()

      ctx.fillStyle = '#5EEAD4'
      ctx.beginPath()
      ctx.arc(x + 11, y - 8, 10, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#1E293B'
      ctx.beginPath()
      ctx.arc(x + 8, y - 9, 2, 0, Math.PI * 2)
      ctx.arc(x + 14, y - 9, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawObstacle = (obs: Obstacle, h: number) => {
      const y = h - GROUND_OFFSET - obs.h
      ctx.fillStyle = '#FF5A5F'
      ctx.beginPath()
      ctx.roundRect(obs.x, y, obs.w, obs.h, 4)
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 10px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(obs.label, obs.x + obs.w / 2, y + obs.h / 2 + 4)
    }

    const tick = () => {
      const s = stateRef.current
      const w = s.width
      const h = s.height

      ctx.clearRect(0, 0, w, h)
      drawGround(w, h)

      if (s.running && !s.gameOver) {
        s.frame += 1
        s.playerVy += GRAVITY
        s.playerY += s.playerVy
        if (s.playerY > 0) {
          s.playerY = 0
          s.playerVy = 0
        }

        s.spawnTimer += 1
        if (s.spawnTimer > 90 - Math.min(s.score, 40)) {
          s.spawnTimer = 0
          const obsH = 22 + Math.floor(Math.random() * 18)
          s.obstacles.push({
            x: w + 10,
            w: 18 + Math.floor(Math.random() * 12),
            h: obsH,
            label: labels[Math.floor(Math.random() * labels.length)]!,
          })
        }

        s.obstacles = s.obstacles.filter((o) => {
          o.x -= s.speed
          return o.x + o.w > 0
        })

        if (s.frame % 12 === 0) {
          s.score += 1
          s.speed = Math.min(7.5, 4.2 + s.score * 0.008)
          setScore(s.score)
        }

        const px = 48
        const py = h - GROUND_OFFSET - PLAYER_H + s.playerY
        for (const o of s.obstacles) {
          const oy = h - GROUND_OFFSET - o.h
          if (px + PLAYER_W - 4 > o.x && px + 4 < o.x + o.w && py + PLAYER_H > oy + 2) {
            s.running = false
            s.gameOver = true
            setGameOver(true)
            setBest((prev) => {
              const next = Math.max(prev, s.score)
              sessionStorage.setItem('edusync-wait-game-best', String(next))
              return next
            })
            break
          }
        }
      }

      for (const o of s.obstacles) drawObstacle(o, h)
      drawPlayer(h)

      if (!s.everStarted) {
        ctx.fillStyle = 'rgba(72, 72, 72, 0.75)'
        ctx.font = '600 13px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Press Space or Tap to start', w / 2, h / 2 - 6)
        ctx.font = '13px system-ui, sans-serif'
        ctx.fillStyle = 'rgba(118, 118, 118, 0.9)'
        ctx.fillText('Jump over the error blocks!', w / 2, h / 2 + 14)
      }

      if (s.gameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)'
        ctx.fillRect(w / 2 - 90, h / 2 - 28, 180, 56)
        ctx.strokeStyle = '#EBEBEB'
        ctx.strokeRect(w / 2 - 90, h / 2 - 28, 180, 56)
        ctx.fillStyle = '#484848'
        ctx.font = '600 14px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Nice run!', w / 2, h / 2 - 8)
        ctx.font = '12px system-ui, sans-serif'
        ctx.fillStyle = '#767676'
        ctx.fillText('Tap or Space to play again', w / 2, h / 2 + 12)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        jump()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      ro.disconnect()
    }
  }, [jump])

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white shadow-sm dark:border-border dark:bg-card',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[#EBEBEB] px-4 py-3 dark:border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#484848] dark:text-foreground">
          <Gamepad2 className="h-4 w-4 text-[#FF5A5F]" />
          Reconnect Run
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-[#767676] dark:text-muted-foreground">
          <span>Score: {score}</span>
          <span>Best: {best}</span>
        </div>
      </div>

      <div className="px-3 pb-3 pt-2">
        <p className="mb-2 text-center text-xs text-[#767676] dark:text-muted-foreground">
          While the server reconnects — jump over the glitches!
        </p>
        <div
          ref={containerRef}
          className="cursor-pointer rounded-xl bg-[#FAFAFA] outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#FF5A5F] dark:bg-muted/30"
          role="button"
          tabIndex={0}
          aria-label="Reconnect Run mini game. Press space or tap to jump."
          onClick={jump}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              jump()
            }
          }}
        >
          <canvas ref={canvasRef} className="block w-full rounded-xl" />
        </div>
        {gameOver && (
          <div className="mt-2 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                resetGame()
              }}
            >
              <RotateCcw className="h-3 w-3" />
              Play again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
