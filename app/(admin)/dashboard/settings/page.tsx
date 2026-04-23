"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { getAllSettings, saveSettings, type GSTData, type Milestone } from "@/services/settingsService";

type BankData = Record<string, any>;
type BrandData = Record<string, any>;
type NumberingData = Record<string, any>;

const tabs = ["GST Configuration", "Milestones", "Branding", "Bank Details", "Document Numbering"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("GST Configuration");
  const [loading, setLoading] = useState(true);

  const [gstData, setGstData] = useState<GSTData>({});
  const [bankData, setBankData] = useState<BankData>({});
  const [brandData, setBrandData] = useState<BrandData>({});
  const [numberingData, setNumberingData] = useState<NumberingData>({});
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const gstFields: (keyof GSTData)[] = ["default_cgst", "default_sgst", "default_igst"];

  useEffect(() => { fetchAllSettings(); }, []);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const settings = await getAllSettings();
      setGstData(settings.gst);
      setBankData(settings.bank);
      setBrandData(settings.brand);
      setNumberingData(settings.numbering);
      setMilestones(settings.milestones);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (endpoint: string, data: any) => {
    try {
      await saveSettings(endpoint, data);
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to save settings");
    }
  };

  const addMilestone = () => setMilestones([...milestones, { label: "New Milestone", percentage: 0 }]);
  const deleteMilestone = (_id: number | undefined, index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const totalPercentage = milestones.reduce((s, m) => s + (m.percentage || 0), 0);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-[#C8922A]" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1C1C1C]">Settings</h1>
        <p className="text-[13px] text-[#9A8F82] mt-0.5">Configure your firm's billing preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-[220px] shrink-0">
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-2 sticky top-4">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all mb-0.5 ${activeTab === t ? "bg-[#FDF3E3] text-[#C8922A] font-semibold" : "text-[#6B6259] hover:bg-[#FAF8F5]"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">

          {/* GST */}
          {activeTab === "GST Configuration" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">GST Configuration</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Firm GSTIN</label>
                  <input type="text" value={gstData.firm_gstin || ""} onChange={e => setGstData({ ...gstData, firm_gstin: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Place of Supply</label>
                  <input type="text" value={gstData.place_of_supply || ""} onChange={e => setGstData({ ...gstData, place_of_supply: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
                {gstFields.map((field) => (
                  <div key={field}>
                    <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">{field.replace("default_", "").toUpperCase()} %</label>
                    <input type="number" value={gstData[field] || ""} onChange={e => setGstData({ ...gstData, [field]: Number(e.target.value) })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                  </div>
                ))}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">SAC Code</label>
                  <input type="text" value={gstData.sac_code || ""} onChange={e => setGstData({ ...gstData, sac_code: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
              </div>
              <button onClick={() => handleSave("tax", gstData)} className="mt-6 flex items-center gap-2 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold">
                <Save size={14} /> Save GST Settings
              </button>
            </div>
          )}

          {/* Milestones */}
          {activeTab === "Milestones" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold">Milestone Templates</h2>
                <div className={`text-[13px] font-semibold flex items-center gap-1.5 ${totalPercentage === 100 ? "text-green-600" : "text-red-500"}`}>
                  <AlertCircle size={14} /> Total: {totalPercentage}% {totalPercentage === 100 ? "(Valid)" : "(Must be 100%)"}
                </div>
              </div>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8DF]">
                    <input type="text" value={m.label} onChange={e => { const copy = [...milestones]; copy[i].label = e.target.value; setMilestones(copy); }} className="flex-1 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] outline-none" />
                    <input type="number" value={m.percentage} onChange={e => { const copy = [...milestones]; copy[i].percentage = Number(e.target.value); setMilestones(copy); }} className="w-20 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-center" />
                    <button onClick={() => deleteMilestone(m.id, i)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button onClick={addMilestone} className="mt-3 flex items-center gap-1 text-[13px] text-[#C8922A] font-medium"><Plus size={14} /> Add Milestone</button>
              <button disabled={totalPercentage !== 100} onClick={() => handleSave("milestones", milestones)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px] disabled:opacity-50">Save Milestones</button>
            </div>
          )}

          {/* Branding */}
          {activeTab === "Branding" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">Branding</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Firm Name</label>
                  <input type="text" value={brandData.firm_name || ""} onChange={e => setBrandData({ ...brandData, firm_name: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Email</label>
                  <input type="email" value={brandData.firm_email || ""} onChange={e => setBrandData({ ...brandData, firm_email: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Phone</label>
                  <input type="text" value={brandData.firm_phone || ""} onChange={e => setBrandData({ ...brandData, firm_phone: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Footer Text</label>
                  <textarea value={brandData.footer_text || ""} onChange={e => setBrandData({ ...brandData, footer_text: e.target.value })} rows={3} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" />
                </div>
              </div>
              <button onClick={() => handleSave("brand", brandData)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px]">Save Branding</button>
            </div>
          )}

          {/* Bank Details */}
          {activeTab === "Bank Details" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">Bank Details</h2>
              <div className="grid grid-cols-2 gap-5">
                {Object.keys(bankData).filter(key => !['id', 'updated_at', 'upi_qr_code'].includes(key)).map(key => (
                  <div key={key}>
                    <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">{key.replace(/_/g, " ")}</label>
                    <input type="text" value={bankData[key] || ""} onChange={e => setBankData({ ...bankData, [key]: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                  </div>
                ))}
              </div>
              <button onClick={() => handleSave("bank", bankData)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px]">Save Bank Details</button>
            </div>
          )}

          {/* Document Numbering */}
          {activeTab === "Document Numbering" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">Document Numbering</h2>
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Quote Prefix</label>
                  <input type="text" value={numberingData.quote_prefix || ""} onChange={e => setNumberingData({ ...numberingData, quote_prefix: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Invoice Prefix</label>
                  <input type="text" value={numberingData.invoice_prefix || ""} onChange={e => setNumberingData({ ...numberingData, invoice_prefix: e.target.value })} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="reset" checked={numberingData.reset_yearly || false} onChange={e => setNumberingData({ ...numberingData, reset_yearly: e.target.checked })} />
                <label htmlFor="reset" className="text-[13px] text-[#6B6259]">Reset numbering every financial year</label>
              </div>
              <button onClick={() => handleSave("numbering", numberingData)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px]">Save Numbering</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}