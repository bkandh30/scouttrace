import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '../components/layout/hero-section'
import Features from '../components/layout/features'
import Workflow from '../components/layout/workflow'

export const Route = createFileRoute('/')({ component: App })

function App() {
    return (
        <div>
            <HeroSection />
            <Features />
            <Workflow />
        </div>
    )
}
