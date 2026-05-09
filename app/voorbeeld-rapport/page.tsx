export default function VoorbeeldRapportPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-5">
            Voorbeeldrapport
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-5">
            Bekijk een voorbeeld van een kascontrolerapport
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ontdek hoe een professioneel kascontrolerapport van Slimme Kascontrole eruitziet.
            Dit voorbeeld bevat fictieve gegevens en laat exact zien wat u als VvE ontvangt.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-0">

            <div className="p-10 border-b lg:border-b-0 lg:border-r border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Wat ontvangt u?
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <div>✅ Analyse van inkomsten en uitgaven</div>
                <div>✅ Controle van banksaldi en transacties</div>
                <div>✅ Analyse van openstaande posten</div>
                <div>✅ Inzichtelijke tabellen en bevindingen</div>
                <div>✅ Advies voor de Algemene Ledenvergadering</div>
              </div>

              <div className="mt-8 p-5 rounded-2xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
                Dit betreft een volledig fictief demo-rapport bedoeld als voorbeeld van het uiteindelijke kascontrolerapport.
              </div>
            </div>

            <div className="p-10 flex flex-col justify-center items-center bg-gray-50">

              <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="text-6xl mb-5">
                  📄
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Voorbeeldrapport PDF
                </h3>

                <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                  Download een volledig voorbeeld van een professioneel VvE kascontrolerapport.
                </p>

                <a
                  href="/voorbeeldrapport-slimme-kascontrole.pdf"
                  target="_blank"
                  className="inline-flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
                >
                  Download voorbeeldrapport
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 transition text-gray-800 font-medium"
          >
            Terug naar homepage
          </a>
        </div>
      </div>
    </main>
  )
}
