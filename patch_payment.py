import pathlib, sys

p = pathlib.Path("subscribe.html")
s = p.read_text()

old_tx = '''      <div class="field">
        <label for="transaction_id">Transaction ID</label>
        <input type="text" id="transaction_id" required placeholder="From your MoMo/Airtel confirmation SMS" />
      </div>

      <div class="field">
        <label for="screenshot">Payment screenshot</label>
        <input type="file" id="screenshot" accept="image/*" required />
      </div>'''
new_tx = '''      <div class="field">
        <label for="payer_phone">Phone number you paid from</label>
        <input type="tel" id="payer_phone" required inputmode="numeric" placeholder="e.g. 0788123456" />
      </div>

      <div class="field">
        <label for="screenshot">Payment screenshot (optional)</label>
        <input type="file" id="screenshot" accept="image/*" />
      </div>'''
if old_tx not in s:
    sys.exit("subscribe.html: form block not found (already patched or different file)")
s = s.replace(old_tx, new_tx)

a = s.index('    const transactionId = document.getElementById("transaction_id").value.trim();')
b = s.index("    showMessage(\"Submitted! You'll be upgraded once it's reviewed.\", \"success\");")
new_js = '''    let phone = document.getElementById("payer_phone").value.replace(/\\D/g, "");
    if (phone.startsWith("250")) phone = "0" + phone.slice(3);
    if (!/^07\\d{8}$/.test(phone)) {
      showMessage("Please enter the phone number you paid from, like 0788123456.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit for review";
      return;
    }

    const file = document.getElementById("screenshot").files[0];

    let filePath = null;
    if (file) {
      filePath = `${currentUser.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabaseClient.storage
        .from("payment-screenshots")
        .upload(filePath, file);

      if (uploadError) {
        showMessage("Upload failed: " + uploadError.message, "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit for review";
        return;
      }
    }

    const { error: insertError } = await supabaseClient.from("payments").insert({
      user_id: currentUser.id,
      plan,
      amount,
      payer_phone: phone,
      screenshot_path: filePath,
      status: "pending",
    });

    if (insertError) {
      showMessage("Couldn't save your submission: " + insertError.message, "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit for review";
      return;
    }

'''
s = s[:a] + new_js + s[b:]
s = s.replace("then submit your transaction details below.", "then enter the phone number you paid from below. A screenshot of the payment message is optional, but it helps us confirm faster.")
p.write_text(s)

q = pathlib.Path("admin.html")
t = q.read_text()
t = t.replace('.select("id, plan, amount, transaction_id, screenshot_path, status, created_at, user_id, profiles(full_name, level)")',
              '.select("id, plan, amount, payer_phone, transaction_id, screenshot_path, status, created_at, user_id, profiles(full_name, level)")')
old_ss = '''      const { data: signed } = await supabaseClient.storage
        .from("payment-screenshots")
        .createSignedUrl(p.screenshot_path, 300);
      const screenshotUrl = signed ? signed.signedUrl : "#";
'''
new_ss = '''      let screenshotHtml = '<p style="margin-top:16px; color:var(--muted, #666);">No screenshot attached.</p>';
      if (p.screenshot_path) {
        const { data: signed } = await supabaseClient.storage
          .from("payment-screenshots")
          .createSignedUrl(p.screenshot_path, 300);
        if (signed) {
          screenshotHtml = `<p style="margin-top:16px;"><a href="${signed.signedUrl}" target="_blank" rel="noopener" class="btn btn-ghost">View screenshot</a></p>`;
        }
      }
'''
if old_ss not in t:
    sys.exit("admin.html: screenshot block not found (already patched or different file)")
t = t.replace(old_ss, new_ss)
t = t.replace('''        <div class="dashboard-row"><span>Transaction ID</span><span>${p.transaction_id}</span></div>''',
'''        <div class="dashboard-row"><span>Paid from</span><span>${p.payer_phone || "—"}</span></div>
        ${p.transaction_id ? `<div class="dashboard-row"><span>Transaction ID</span><span>${p.transaction_id}</span></div>` : ""}''')
t = t.replace('''        <p style="margin-top:16px;"><a href="${screenshotUrl}" target="_blank" rel="noopener" class="btn btn-ghost">View screenshot</a></p>''',
              '''        ${screenshotHtml}''')
q.write_text(t)
print("DONE: subscribe.html and admin.html updated")
