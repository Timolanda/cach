import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart, Lock, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-600">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Transform Your Digital Assets with Cach
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                Tokenize your businesses, ideas, music albums, and social media channels. Unlock the true value of your digital presence.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">Get Started</Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Asset Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart className="w-12 h-12 mb-4 text-blue-600" />
                <p>Advanced algorithms analyze factors like followers, engagement, and likes for transparent asset valuation.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <Users className="w-12 h-12 mb-4 text-blue-600" />
                <p>Trade, lend, and swap tokenized shares with intuitive tools for creators and investors.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Verification Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <Lock className="w-12 h-12 mb-4 text-blue-600" />
                <p>Three security tiers: No Stake, 20% Stake, and Fully Audited, ensuring confidence in asset quality.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Entrepreneurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tokenize your assets and sell shares to raise capital for your ventures.</p>
                <Button variant="link" className="mt-4">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Invest in tokenized shares and earn returns from innovative digital assets.</p>
                <Button variant="link" className="mt-4">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Affiliates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access resources to grow your business and expand your network.</p>
                <Button variant="link" className="mt-4">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

