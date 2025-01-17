import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AffiliatesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">For Affiliates</h1>
      <p className="text-xl mb-12">Grow your business by connecting entrepreneurs with investors in the digital asset space.</p>
      
      <h2 className="text-2xl font-semibold mb-6">Benefits of Becoming an Affiliate</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Earn Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Receive competitive commissions for every successful referral that leads to asset tokenization or investment.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expand Your Network</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Connect with entrepreneurs and investors from around the world, growing your professional network.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Access Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Get exclusive access to marketing materials, training, and support to help you succeed as an affiliate.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6">How to Get Started</h2>
      <ol className="list-decimal list-inside mb-12 space-y-2">
        <li>Apply to become a Cach affiliate</li>
        <li>Complete our affiliate onboarding process</li>
        <li>Access your personalized affiliate dashboard</li>
        <li>Start promoting Cach to your network</li>
        <li>Track your referrals and earnings in real-time</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-6">Resources for Affiliates</h2>
      <ul className="list-disc list-inside mb-12 space-y-2">
        <li>Marketing materials and banners</li>
        <li>Educational content about digital asset tokenization</li>
        <li>Regular webinars and training sessions</li>
        <li>Dedicated affiliate support team</li>
      </ul>

      <div className="text-center">
        <Button size="lg">Become an Affiliate</Button>
      </div>
    </div>
  )
}

