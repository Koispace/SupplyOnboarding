import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, FileEdit, Send, Activity, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { triggerAIPipeline, submitProductForReview } from '@/lib/dashboard/productCreation'

export default function Step5AIReview({ productId, aiReviewResults, setAiReviewResults, onBack, onComplete }) {
  const [processing, setProcessing] = useState(!aiReviewResults)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function runExtraction() {
      if (aiReviewResults) return
      
      try {
        setProcessing(true)
        const results = await triggerAIPipeline(productId)
        setAiReviewResults(results)
      } catch (err) {
        console.error('Failed AI Extraction:', err)
        alert('There was an issue parsing your labels. Please try again.')
        onBack()
      } finally {
        setProcessing(false)
      }
    }

    if (productId && !aiReviewResults) {
      runExtraction()
    }
  }, [productId, aiReviewResults, setAiReviewResults, onBack])

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      await submitProductForReview(productId)
      onComplete()
    } catch (err) {
      console.error('Failed to submit for review', err)
      alert('Failed to submit product. Please try again.')
      setSubmitting(false)
    }
  }

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#4F3863] rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="w-20 h-20 bg-white rounded-full border border-gray-100 shadow-xl flex items-center justify-center relative z-10">
            <Activity className="w-10 h-10 text-[#4F3863] animate-bounce" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Label Extraction in Progress</h3>
        <p className="text-gray-500 text-center max-w-md">
          KOI is scanning your nutrition panels and ingredient lists to verify claims and check for banned substances. This takes a few seconds...
        </p>
      </div>
    )
  }

  if (!aiReviewResults) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">AI Review Complete</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Score: {aiReviewResults.healthScore}/100
            </span>
          </div>
          <p className="text-gray-500">Please review the extracted data before final submission.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Nutrition & Ingredients */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" />
              Extracted Nutrition (per 100g)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(aiReviewResults.nutrition).map(([key, value]) => (
                <div key={key} className="bg-white p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-bold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" />
              Detected Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {aiReviewResults.ingredients.map((ing, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Flags & Actions */}
        <div className="space-y-6">
          {aiReviewResults.flags.length > 0 ? (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h4 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Attention Required ({aiReviewResults.flags.length})
              </h4>
              <div className="space-y-3">
                {aiReviewResults.flags.map((flag, idx) => (
                  <div key={idx} className="bg-white/60 p-4 rounded-xl border border-amber-200/50">
                    <p className="text-sm text-amber-800 font-medium leading-relaxed">
                      {flag.message}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-700 mt-4">
                You can still submit, but these flags will be reviewed manually by the KOI team.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-900">All Clear!</h4>
                <p className="text-sm text-green-700">No discrepancies or banned substances detected.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">Next Steps</h4>
            <p className="text-sm text-gray-600 mb-6">
              If the extracted information looks incorrect, you can go back and upload clearer label images. Otherwise, submit for final approval.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={onBack}
                disabled={submitting}
                className="flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 h-12 font-semibold"
              >
                <FileEdit className="w-4 h-4 mr-2" />
                Edit Labels
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="flex-1 bg-[#4F3863] hover:bg-[#382648] text-white rounded-xl h-12 font-semibold shadow-md"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Approval
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
