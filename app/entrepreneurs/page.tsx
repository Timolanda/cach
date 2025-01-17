import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EntrepreneursPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">For Entrepreneurs</h1>
      <p className="text-xl mb-12">Unlock the potential of your digital assets and raise capital for your ventures.</p>
      
      <h2 className="text-2xl font-semibold mb-6">How to Tokenize Your Assets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>1. Evaluate</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Use our advanced algorithms to get a fair and transparent valuation of your digital asset.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Tokenize</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Convert your asset into tradable tokens, defining the number of shares and their initial value.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>3. List</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Make your tokenized asset available on our marketplace for investors to purchase shares.</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Benefits for Entrepreneurs</h2>
      <ul className="list-disc list-inside mb-12 space-y-2">
        <li>Access to a global pool of investors</li>
        <li>Retain control while raising capital</li>
        <li>Transparent and fair asset valuation</li>
        <li>Flexible fundraising options</li>
        <li>Increased liquidity for your digital assets</li>
      </ul>

      <div className="text-center">
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  )
}

