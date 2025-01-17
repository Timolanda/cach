import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function InvestorsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">For Investors</h1>
      <p className="text-xl mb-12">Discover unique investment opportunities in the digital asset space.</p>
      
      <h2 className="text-2xl font-semibold mb-6">Why Invest in Tokenized Shares</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Diversification</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access a wide range of digital assets to diversify your investment portfolio.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Liquidity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Easily trade your tokenized shares on our marketplace with enhanced liquidity.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transparency</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Benefit from our verification levels and transparent asset valuation process.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6">How to Start Investing</h2>
      <ol className="list-decimal list-inside mb-12 space-y-2">
        <li>Create an account on the Cach platform</li>
        <li>Complete the verification process</li>
        <li>Browse available tokenized assets</li>
        <li>Analyze asset performance and potential</li>
        <li>Purchase shares of your chosen assets</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-6">Earning Returns</h2>
      <p className="mb-6">As an investor in tokenized shares, you can earn returns through:</p>
      <ul className="list-disc list-inside mb-12 space-y-2">
        <li>Appreciation in share value</li>
        <li>Revenue sharing from asset performance</li>
        <li>Dividends from profitable ventures</li>
      </ul>

      <div className="text-center">
        <Button size="lg">Start Investing Now</Button>
      </div>
    </div>
  )
}

