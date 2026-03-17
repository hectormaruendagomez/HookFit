import { useState } from 'react';
import { ArrowLeft, Crown, Check, Lock, CreditCard, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentPage({ onBack, onPaymentComplete }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const { lang } = useLanguage();

  const isEs = lang === 'es';

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvc.length >= 3 && name.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  const features = isEs
    ? ['Análisis ilimitados de vídeos', 'Espía Intel — tendencias en tiempo real', 'Diagnóstico avanzado de retención', 'Soporte prioritario', 'Acceso a todas las funciones futuras']
    : ['Unlimited video analysis', 'Spy Intel — real-time trends', 'Advanced retention diagnostics', 'Priority support', 'Access to all future features'];

  return (
    <section className="min-h-screen py-12 px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{isEs ? 'Volver' : 'Back'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Order summary */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                {isEs ? 'Finalizar compra' : 'Checkout'}
              </h1>
              <p className="text-gray-500 text-sm">
                {isEs ? 'Estás a un paso de desbloquear todo el potencial de HookFit.' : "You're one step away from unlocking HookFit's full potential."}
              </p>
            </div>

            {/* Plan card */}
            <div className="bg-white rounded-2xl border-2 border-neon-400/30 p-6 shadow-[0_8px_40px_rgba(57,255,20,0.08)]">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neon-400 to-brand-500 flex items-center justify-center shadow-lg">
                  <Crown className="w-7 h-7 text-gray-950" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Plan Pro</h3>
                  <p className="text-sm text-gray-500">{isEs ? 'Facturación mensual' : 'Monthly billing'}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-3xl font-black text-neon-500">€29</span>
                  <span className="text-sm text-gray-500">/{isEs ? 'mes' : 'mo'}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              <div className="space-y-3">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-neon-400/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-neon-500" />
                    </div>
                    <span className="text-sm text-gray-600">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">{isEs ? 'Pago seguro SSL' : 'SSL Secure Payment'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-medium">{isEs ? 'Datos encriptados' : 'Encrypted data'}</span>
              </div>
            </div>
          </div>

          {/* Right — Payment form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{isEs ? 'Datos de pago' : 'Payment details'}</h3>
                  <p className="text-xs text-gray-400">{isEs ? 'Introduce los datos de tu tarjeta' : 'Enter your card information'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Card holder name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Titular de la tarjeta' : 'Cardholder name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEs ? 'Nombre completo' : 'Full name'}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-400/30 focus:border-neon-400/50 transition-all"
                  />
                </div>

                {/* Card number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    {isEs ? 'Número de tarjeta' : 'Card number'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-400/30 focus:border-neon-400/50 transition-all font-mono tracking-wider"
                  />
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      {isEs ? 'Vencimiento' : 'Expiry'}
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-400/30 focus:border-neon-400/50 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-400/30 focus:border-neon-400/50 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Plan Pro ({isEs ? 'mensual' : 'monthly'})</span>
                    <span className="text-sm font-semibold text-gray-900">€29.00</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{isEs ? 'Impuestos' : 'Tax'}</span>
                    <span className="text-sm font-semibold text-gray-900">€0.00</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">Total</span>
                    <span className="text-lg font-black text-neon-500">€29.00</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!isFormValid || processing}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isFormValid && !processing
                      ? 'bg-neon-400 text-gray-950 hover:bg-neon-300 shadow-lg glow-neon hover:glow-neon-strong'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isEs ? 'Procesando...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {isEs ? 'Confirmar y pagar €29.00' : 'Confirm & pay €29.00'}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  {isEs
                    ? 'Puedes cancelar tu suscripción en cualquier momento desde tu perfil.'
                    : 'You can cancel your subscription anytime from your profile.'}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
