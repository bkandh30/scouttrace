import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '../components/layout/hero-section'
import Features from '../components/layout/features'

export const Route = createFileRoute('/')({ component: App })

function App() {
    return (
        <div>
            <HeroSection />
            <Features />
        </div>
    )
}
