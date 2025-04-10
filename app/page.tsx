"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CountUp from 'react-countup'

type StatCardProps = {
  label: string
  value: number
  prefix?: string
  suffix?: string
}

const mockLiveStats = {
  totalStreamed: 1208374,
  activeDonors: 482,
  activeScholars: 129,
  avgAPY: 5.43,
}

const mockActivityFeed = [
  { id: 1, message: '🎓 dims.edu received 25 USDC for the STEM Stars Scholarship' },
  { id: 2, message: '🌟 0xabc...39F1 received 50 USDC for the Global Learning Grant' },
  { id: 3, message: '🎉 zara.edu received 100 USDC for the Women in Tech Fund' },
  { id: 4, message: '💡 0x9b2...E10A received 2.75 USDC for the Dev Pathway Scholarship' },
  { id: 5, message: '🚀 lila.edu received 10 USDC for the Future Coders Program' },
]

export default function ScholarStreamLanding() {
  const [feedIndex, setFeedIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIndex((prev) => (prev + 1) % mockActivityFeed.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const headlines = [
    'Scholarships That Earn While They Give',
    'Aid That Compounds with Every Block',
    'On-Chain Yield for Off-Chain Impact',
    'Programmable Funding. Infinite Logic.',
    'DeFi-Powered Support, Streamed in Seconds',
    'Smart Contracts, Smarter Education',
    'Donations That Never Sleep',
    'Capital That Grows with Every Learner',
    'ERC-4626 Vaults for Regenerative Aid',
    'Funding Flows That Write Themselves',
  ]

  const [displayedText, setDisplayedText] = useState('')
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentHeadline = headlines[headlineIndex]
  
    if (charIndex < currentHeadline.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentHeadline[charIndex])
        setCharIndex((prev) => prev + 1)
      }, 50) // typing speed
      return () => clearTimeout(timeout)
    } else {
      const hold = setTimeout(() => {
        setCharIndex(0)
        setDisplayedText('')
        setHeadlineIndex((prev) => (prev + 1) % headlines.length)
      }, 2500) // pause before typing next headline
      return () => clearTimeout(hold)
    }
  }, [charIndex, headlineIndex])

  return (
    <main className="bg-white text-slate-900 min-h-screen font-sans">
      <section className="text-center py-24 px-4">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-blue-600 min-h-[3.5rem] sm:min-h-[4.5rem]">
          {displayedText.length ? displayedText : <br/>}
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-slate-700">
          Built on <strong>EduChain</strong>, ScholarStream enables real-time, yield-generating, programmable funding for students—scaling access to education across the globe.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/awardee">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl">
              Apply for Funding
            </button>
          </Link>
          <Link href="/donor/manage-awardees">
            <button className="border border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-xl">
              Start Giving
            </button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 mb-20">
        <StatCard label="Total Streamed" value={mockLiveStats.totalStreamed} prefix="$" />
        <StatCard label="Active Donors" value={mockLiveStats.activeDonors} />
        <StatCard label="Active Scholars" value={mockLiveStats.activeScholars} />
        <StatCard label="Vault APY (avg)" value={mockLiveStats.avgAPY} suffix="%" />
      </section>

      <div className="max-w-xl mx-auto text-center text-slate-900 shadow text-lg bg-white p-4 rounded-xl mb-8">
        <p className="transition-all duration-500 ease-in-out">
          {mockActivityFeed[feedIndex].message}
        </p>
      </div>

      <section className="py-20 bg-white px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10 text-slate-800">
          🌱 A Scholarship That Grows While It Gives
        </h2>
        <p className="max-w-3xl mx-auto text-center text-slate-600 text-lg">
          Imagine Maya receives a scholarship not as a lump sum—but as a <strong>stream of funds per second</strong>, covering her daily needs exactly when she needs them. And while she learns, the scholarship <strong>earns</strong>—growing yield through on-chain vaults. That’s regenerative education finance.
        </p>
        <div className="mt-10 flex justify-center">
          <div className="w-full sm:max-w-2xl aspect-video rounded-xl overflow-hidden shadow-md">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/EUNmcRVHPhY" // Replace with your actual video ID
              title="ScholarStream Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-12 text-slate-800">
          🔍 Why ScholarStream + EduChain?
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
          <div>
            <h3 className="font-bold text-slate-700 mb-1">🎓 Real-time disbursement</h3>
            <p className="text-slate-500 text-sm">Scholarships stream second-by-second—no middlemen, no delays.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-1">📈 On-chain yield growth</h3>
            <p className="text-slate-500 text-sm">Funds grow passively via ERC-4626 yield strategies on EduChain.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-1">🔗 Transparency by default</h3>
            <p className="text-slate-500 text-sm">All flows are verifiable and immutable on the blockchain.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-700 mb-1">🛠️ Programmable funding logic</h3>
            <p className="text-slate-500 text-sm">Milestones, conditions, and flow logic are smart contract-defined.</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10 text-slate-800">
          Featured Scholars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {['dims.edu', 'sandro.edu', 'adam.edu'].map((name, idx) => (
            <div key={idx} className="bg-slate-50 p-6 rounded-xl shadow text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">{name}</h3>
              <p className="text-slate-500 text-sm">
                Pursuing Computer Science. Supported through EduChain since 2023.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10 text-slate-800">
          Integration Partners
        </h2>
        <div className="flex justify-center flex-wrap gap-8 max-w-4xl mx-auto">
          {['Educhain', 'OpenCampusID', 'AAVE', 'Compound', 'Beefy'].map((partner, idx) => (
            <div
              key={idx}
              className="bg-slate-100 px-6 py-4 rounded-lg shadow text-slate-700 font-semibold"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-slate-100 text-slate-600 text-sm py-10 px-4 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:items-start">
            <img src="https://media.discordapp.net/attachments/1344978138781974559/1359423115167400008/ChatGPT_Image_Apr_9_2025_02_01_49_PM.png?ex=67f8be6f&is=67f76cef&hm=eea93cd618e4551f26a8be0c79de125d890c1a7a96e440dca70cb6656c5cce16&=&format=webp&quality=lossless&width=1652&height=1652" alt="ScholarStream Logo" className="max-w-[120px] h-auto mb-2" /> {/* Update path as needed */}
            <h1 className="text-2xl font-bold text-slate-800 mb-1">ScholarStream</h1>
            <p className="text-slate-500 max-w-xs">
              Real-time, yield-powered scholarships on EduChain. Empowering learners, globally.
            </p>
          </div>
      
          {/* Social Links */}
          <div className="flex space-x-6">
            <a
              href="https://x.com/scholarstreamfi" // Replace with your X handle
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
              aria-label="X (Twitter)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.97 2H19.5l-5.8 7.07L7.65 2H1l8.62 11.06L1.61 22h3.52l6.27-7.65L16.83 22H23l-9.13-11.77L22.97 2z" />
              </svg>
            </a>
            <a
              href="https://github.com/scholarstream" // Replace with your GitHub repo
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.234c-3.338.727-4.033-1.61-4.033-1.61C4.422 17.07 3.633 16.7 3.633 16.7c-1.087-.744.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.304.762-1.604-2.665-.305-5.466-1.332-5.466-5.932 0-1.31.47-2.38 1.236-3.22-.124-.304-.536-1.526.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.004 2.045.137 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.65.243 2.872.12 3.176.77.84 1.234 1.91 1.234 3.22 0 4.61-2.805 5.624-5.476 5.92.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} ScholarStream. All rights reserved.
        </div>
      </footer>
    </main>
  )
}

function StatCard({ label, value, prefix = '', suffix = '' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900">
        {prefix}
        <CountUp end={value} duration={2} separator="," decimals={suffix === '%' ? 2 : 0} />
        {suffix}
      </h3>
    </div>
  )
}

