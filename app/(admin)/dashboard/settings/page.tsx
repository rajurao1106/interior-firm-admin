"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Save, Upload, Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";

const tabs = ["GST Configuration", "Milestones", "Branding", "Bank Details", "Document Numbering"];

const API_BASE_URL = "http://127.0.0.1:8000/api/v1/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("GST Configuration");
  const [loading, setLoading] = useState(true);
  
  // State for all data
  const [gstData, setGstData] = useState({});
  const [bankData, setBankData] = useState({});
  const [brandData, setBrandData] = useState({});
  const [numberingData, setNumberingData] = useState({});
  const [milestones, setMilestones] = useState([]);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      const [gst, bank, brand, num, mile] = await Promise.all([
        fetch(`${API_BASE_URL}/tax/`).then(res => res.json()),
        fetch(`${API_BASE_URL}/bank/`).then(res => res.json()),
        fetch(`${API_BASE_URL}/brand/`).then(res => res.json()),
        fetch(`${API_BASE_URL}/numbering/`).then(res => res.json()),
        fetch(`${API_BASE_URL}/milestones/`).then(res => res.json()),
      ]);

      setGstData(gst);
      setBankData(bank);
      setBrandData(brand);
      setNumberingData(num);
      setMilestones(mile.results || []);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (endpoint, data, type = "json") => {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to save settings");
    }
  };

  // Milestone specific handlers (as it's a list)
  const addMilestone = () => setMilestones([...milestones, { label: "New Milestone", percentage: 0 }]);
  const deleteMilestone = (id, index) => {
    // If it exists in DB, you might need a DELETE request, otherwise just filter state
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const totalPercentage = milestones.reduce((s, m) => s + parseFloat(m.percentage || 0), 0);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
=======
import { useState } from "react";
import { Save, Upload, Plus, Trash2, AlertCircle } from "lucide-react";

const tabs = ["GST Configuration", "Milestones", "Branding", "Bank Details", "Document Numbering"];

const defaultMilestones = [
  { label: "Advance on Booking", percentage: 10 },
  { label: "After Layout Approval", percentage: 20 },
  { label: "Before 3D Handover", percentage: 25 },
  { label: "Before Execution Start", percentage: 25 },
  { label: "During Execution", percentage: 15 },
  { label: "Final Handover", percentage: 5 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("GST Configuration");
  const [milestones, setMilestones] = useState(defaultMilestones);

  const total = milestones.reduce((s, m) => s + m.percentage, 0);

  return (
    <div>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#1C1C1C]">Settings</h1>
        <p className="text-[13px] text-[#9A8F82] mt-0.5">Configure your firm's billing preferences</p>
      </div>

      <div className="flex gap-6">
<<<<<<< HEAD
        {/* Sidebar */}
        <div className="w-[220px] shrink-0">
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-2 sticky top-4">
=======
        {/* Sidebar tabs */}
        <div className="w-[200px] shrink-0">
          <div className="bg-white rounded-xl border border-[#EDE8DF] p-2">
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all mb-0.5 ${
<<<<<<< HEAD
                  activeTab === t ? "bg-[#FDF3E3] text-[#C8922A] font-semibold" : "text-[#6B6259] hover:bg-[#FAF8F5]"
=======
                  activeTab === t
                    ? "bg-[#FDF3E3] text-[#C8922A] font-semibold"
                    : "text-[#6B6259] hover:bg-[#FAF8F5]"
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Content Area */}
        <div className="flex-1">
          {/* GST CONFIGURATION */}
          {activeTab === "GST Configuration" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">GST Configuration</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Firm GSTIN</label>
                  <input 
                    type="text" 
                    value={gstData.firm_gstin || ""} 
                    onChange={(e) => setGstData({...gstData, firm_gstin: e.target.value})}
                    className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] focus:border-[#C8922A] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Place of Supply</label>
                  <input 
                    type="text" 
                    value={gstData.place_of_supply || ""} 
                    onChange={(e) => setGstData({...gstData, place_of_supply: e.target.value})}
                    className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] focus:border-[#C8922A] outline-none" 
                  />
                </div>
                {["default_cgst", "default_sgst", "default_igst"].map((field) => (
                  <div key={field}>
                    <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">{field.replace("default_", "").toUpperCase()} %</label>
                    <input 
                      type="number" 
                      value={gstData[field] || ""} 
                      onChange={(e) => setGstData({...gstData, [field]: e.target.value})}
                      className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] focus:border-[#C8922A] outline-none" 
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">SAC Code</label>
                  <input 
                    type="text" 
                    value={gstData.sac_code || ""} 
                    onChange={(e) => setGstData({...gstData, sac_code: e.target.value})}
                    className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] focus:border-[#C8922A] outline-none" 
                  />
                </div>
              </div>
              <button onClick={() => handleSave("tax", gstData)} className="mt-6 flex items-center gap-2 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold">
=======
        {/* Content */}
        <div className="flex-1">
          {activeTab === "GST Configuration" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold text-[#1C1C1C] mb-5">GST Configuration</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Firm GSTIN</label>
                  <input type="text" placeholder="e.g. 27AABCU9603R1ZX" className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] text-[#1C1C1C] outline-none focus:border-[#C8922A] transition-colors" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Place of Supply</label>
                  <select className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] text-[#1C1C1C] outline-none focus:border-[#C8922A]">
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Karnataka</option>
                    <option>Gujarat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Default CGST %</label>
                  <input type="number" defaultValue="9" className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Default SGST %</label>
                  <input type="number" defaultValue="9" className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Default IGST %</label>
                  <input type="number" defaultValue="18" className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">SAC/HSN Code</label>
                  <input type="text" placeholder="e.g. 998311" className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
              </div>
              <button className="mt-6 flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors">
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                <Save size={14} /> Save GST Settings
              </button>
            </div>
          )}

<<<<<<< HEAD
          {/* MILESTONES */}
          {activeTab === "Milestones" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold">Milestone Templates</h2>
                <div className={`text-[13px] font-semibold flex items-center gap-1.5 ${totalPercentage === 100 ? "text-green-600" : "text-red-500"}`}>
                  <AlertCircle size={14} /> Total: {totalPercentage}% {totalPercentage === 100 ? "(Valid)" : "(Must be 100%)"}
=======
          {activeTab === "Milestones" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-[#1C1C1C]">Milestone Templates</h2>
                <div className={`text-[13px] font-semibold flex items-center gap-1.5 ${total === 100 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  <AlertCircle size={14} />
                  Total: {total}% {total === 100 ? "(Valid)" : "(Must be 100%)"}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                </div>
              </div>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg border border-[#EDE8DF]">
<<<<<<< HEAD
=======
                    <span className="w-6 h-6 rounded-full bg-[#FDF3E3] text-[#C8922A] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => {
                        const copy = [...milestones];
<<<<<<< HEAD
                        copy[i].label = e.target.value;
                        setMilestones(copy);
                      }}
                      className="flex-1 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] outline-none"
                    />
                    <input
                      type="number"
                      value={m.percentage}
                      onChange={(e) => {
                        const copy = [...milestones];
                        copy[i].percentage = e.target.value;
                        setMilestones(copy);
                      }}
                      className="w-20 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] text-center"
                    />
                    <button onClick={() => deleteMilestone(m.id, i)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button onClick={addMilestone} className="mt-3 flex items-center gap-1 text-[13px] text-[#C8922A] font-medium"><Plus size={14} /> Add Milestone</button>
              <button disabled={totalPercentage !== 100} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px] disabled:opacity-50">Save Milestones</button>
            </div>
          )}

          {/* BRANDING */}
          {activeTab === "Branding" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">Branding</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Firm Name</label>
                  <input 
                    type="text" 
                    value={brandData.firm_name || ""} 
                    onChange={(e) => setBrandData({...brandData, firm_name: e.target.value})}
                    className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Email</label>
                  <input type="email" value={brandData.firm_email || ""} onChange={(e) => setBrandData({...brandData, firm_email: e.target.value})} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Phone</label>
                  <input type="text" value={brandData.firm_phone || ""} onChange={(e) => setBrandData({...brandData, firm_phone: e.target.value})} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div className="col-span-2">
                   <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Footer Text</label>
                   <textarea 
                    value={brandData.footer_text || ""} 
                    onChange={(e) => setBrandData({...brandData, footer_text: e.target.value})}
                    rows={3} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none resize-none" 
                  />
                </div>
              </div>
              <button onClick={() => handleSave("brand", brandData)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px]">Save Branding</button>
            </div>
          )}

          {/* BANK DETAILS */}
          {activeTab === "Bank Details" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">Bank Details</h2>
              <div className="grid grid-cols-2 gap-5">
                {Object.keys(bankData).filter(key => !['id', 'updated_at', 'upi_qr_code'].includes(key)).map((key) => (
                  <div key={key}>
                    <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">{key.replace("_", " ")}</label>
                    <input 
                      type="text" 
                      value={bankData[key] || ""} 
                      onChange={(e) => setBankData({...bankData, [key]: e.target.value})}
                      className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" 
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => handleSave("bank", bankData)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px]">Save Bank Details</button>
            </div>
          )}

          {/* DOCUMENT NUMBERING */}
          {activeTab === "Document Numbering" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold mb-5">Document Numbering</h2>
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Quote Prefix</label>
                  <input type="text" value={numberingData.quote_prefix || ""} onChange={(e) => setNumberingData({...numberingData, quote_prefix: e.target.value})} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase">Invoice Prefix</label>
                  <input type="text" value={numberingData.invoice_prefix || ""} onChange={(e) => setNumberingData({...numberingData, invoice_prefix: e.target.value})} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={numberingData.reset_yearly} onChange={(e) => setNumberingData({...numberingData, reset_yearly: e.target.checked})} id="reset" />
                <label htmlFor="reset" className="text-[13px] text-[#6B6259]">Reset numbering every financial year</label>
              </div>
              <button onClick={() => handleSave("numbering", numberingData)} className="mt-5 bg-[#C8922A] text-white px-5 py-2.5 rounded-lg text-[13px]">Save Numbering</button>
=======
                        copy[i] = { ...copy[i], label: e.target.value };
                        setMilestones(copy);
                      }}
                      className="flex-1 bg-white border border-[#EDE8DF] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#C8922A]"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        value={m.percentage}
                        onChange={(e) => {
                          const copy = [...milestones];
                          copy[i] = { ...copy[i], percentage: parseInt(e.target.value) || 0 };
                          setMilestones(copy);
                        }}
                        className="w-16 bg-white border border-[#EDE8DF] rounded-lg px-2 py-2 text-[13px] text-center outline-none focus:border-[#C8922A]"
                      />
                      <span className="text-[13px] text-[#9A8F82]">%</span>
                    </div>
                    <button
                      onClick={() => setMilestones(milestones.filter((_, j) => j !== i))}
                      className="p-1.5 rounded-md hover:bg-[#FEF2F2] text-[#9A8F82] hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setMilestones([...milestones, { label: "New Milestone", percentage: 0 }])}
                className="mt-3 flex items-center gap-2 text-[13px] text-[#C8922A] hover:underline font-medium"
              >
                <Plus size={13} /> Add Milestone
              </button>
              <button className="mt-5 flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors">
                <Save size={14} /> Save Milestones
              </button>
            </div>
          )}

          {activeTab === "Branding" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold text-[#1C1C1C] mb-5">Branding</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Firm Name</label>
                  <input type="text" placeholder="Your Interior Design Firm" className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#C8922A" className="w-10 h-10 border border-[#EDE8DF] rounded-lg cursor-pointer" />
                    <input type="text" defaultValue="#C8922A" className="flex-1 border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Logo Upload</label>
                  <div className="border-2 border-dashed border-[#EDE8DF] rounded-xl p-8 text-center hover:border-[#C8922A] transition-colors cursor-pointer">
                    <Upload size={24} className="text-[#9A8F82] mx-auto mb-2" />
                    <p className="text-[13px] text-[#6B6259]">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-[#9A8F82] mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">Footer Disclaimer Text</label>
                  <textarea rows={3} placeholder="This is a computer generated document..." className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A] resize-none" />
                </div>
              </div>
              <button className="mt-5 flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg">
                <Save size={14} /> Save Branding
              </button>
            </div>
          )}

          {activeTab === "Bank Details" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold text-[#1C1C1C] mb-5">Bank Details</h2>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { label: "Bank Name", placeholder: "e.g. HDFC Bank" },
                  { label: "Account Number", placeholder: "Account number" },
                  { label: "IFSC Code", placeholder: "e.g. HDFC0001234" },
                  { label: "UPI ID", placeholder: "e.g. firm@upi" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-[12px] font-semibold text-[#6B6259] mb-1.5 uppercase tracking-wide">{f.label}</label>
                    <input type="text" placeholder={f.placeholder} className="w-full border border-[#EDE8DF] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#C8922A]" />
                  </div>
                ))}
              </div>
              <button className="mt-5 flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg">
                <Save size={14} /> Save Bank Details
              </button>
            </div>
          )}

          {activeTab === "Document Numbering" && (
            <div className="bg-white rounded-xl border border-[#EDE8DF] p-6">
              <h2 className="text-[16px] font-semibold text-[#1C1C1C] mb-5">Document Numbering</h2>
              <div className="space-y-4">
                {[
                  { label: "Proposal Format", example: "PROP-2024-001", current: 1 },
                  { label: "Quotation Format", example: "QUOTE-2024-001", current: 6 },
                  { label: "Invoice Format", example: "INV-2024-001", current: 12 },
                ].map((n) => (
                  <div key={n.label} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EDE8DF]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-semibold text-[#1C1C1C]">{n.label}</p>
                        <p className="text-[12px] text-[#9A8F82] mt-0.5">Example: {n.example}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-[#9A8F82] mb-1">Current Counter</p>
                        <span className="text-[20px] font-bold text-[#C8922A]">{String(n.current).padStart(3, "0")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-5 flex items-center gap-2 bg-[#C8922A] hover:bg-[#B07A20] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg">
                <Save size={14} /> Save Numbering
              </button>
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
            </div>
          )}
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6c8ac3251c45ac69d0416d28f8bc0af4f72707a0
