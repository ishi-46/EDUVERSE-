// EduVerse 3-day free trial
// Shows a "Try free for 3 days" card to students who have never used the trial,
// marks an active trial on the dashboard, and tells students when their trial has ended.
// The trial itself is started on the server by the start_free_trial() database function.

async function setupFreeTrial(boxId) {
  const box = document.getElementById(boxId);
  if (!box) return;

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return;

  const { data: p, error } = await supabaseClient
    .from("profiles")
    .select("trial_used, trial_ends_at, subscription_status, subscription_ends_at, is_admin")
    .eq("id", session.user.id)
    .single();
  if (error || !p || p.is_admin) return;

  const now = new Date();
  const endsAt = p.subscription_ends_at ? new Date(p.subscription_ends_at) : null;
  const active = p.subscription_status === "active" && (!endsAt || endsAt > now);
  const onTrial = active && p.trial_ends_at && endsAt &&
    Math.abs(new Date(p.trial_ends_at) - endsAt) < 60000;

  // Label an active trial on the dashboard
  if (onTrial) {
    const sub = document.getElementById("subscription-value");
    if (sub && !sub.querySelector(".trial-tag")) {
      const tag = document.createElement("span");
      tag.className = "trial-tag";
      tag.textContent = " · Free trial";
      tag.style.cssText = "font-size:0.8rem; color: var(--gold, #B8892B); font-weight:600;";
      sub.appendChild(tag);
    }
    const prompt = document.getElementById("subscribe-prompt");
    if (prompt && prompt.querySelector("a")) prompt.querySelector("a").textContent = "Subscribe now";
    return;
  }
  if (active) return;

  // Trial already used and now over: invite the student to subscribe
  if (p.trial_used) {
    if (boxId === "trial-box-subscribe") return; // already on the subscribe page
    box.innerHTML = `
      <div class="dashboard-card" style="border-left:4px solid var(--gold, #B8892B);">
        <p style="font-weight:600; margin-bottom:6px;">Your 3-day free trial has ended.</p>
        <p style="margin-bottom:14px;">Subscribe to keep using all books, Q&amp;A, quizzes and the Weekly Challenge.</p>
        <a href="subscribe.html" class="btn btn-primary">Subscribe now</a>
      </div>`;
    box.style.display = "block";
    const prompt = document.getElementById("subscribe-prompt");
    if (prompt) prompt.style.display = "none";
    return;
  }

  // Never used: offer the trial
  box.innerHTML = `
    <div class="dashboard-card" style="border-left:4px solid var(--gold, #B8892B);">
      <p class="eyebrow eyebrow-gold" style="margin-bottom:6px;">Free trial</p>
      <h2 style="font-size:1.25rem; margin-bottom:8px;">Try EduVerse free for 3 days</h2>
      <p style="margin-bottom:14px;">Open all books, Q&amp;A and quizzes for 3 days. No payment needed. You can use the free trial only once. (The Weekly Challenge is for subscribed students only.)</p>
      <button type="button" class="btn btn-primary" id="trial-btn">Start my free trial</button>
      <p class="form-message" id="trial-msg" style="margin-top:12px;"></p>
    </div>`;
  box.style.display = "block";

  const btn = document.getElementById("trial-btn");
  const msg = document.getElementById("trial-msg");
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Starting…";
    msg.textContent = ""; msg.className = "form-message";

    const { data, error: rpcError } = await supabaseClient.rpc("start_free_trial");

    if (rpcError || !data) {
      msg.textContent = "Couldn't start your free trial. Please try again, or contact 01eduverse@gmail.com.";
      msg.className = "form-message error";
      btn.disabled = false; btn.textContent = "Start my free trial";
      return;
    }
    if (!data.ok) {
      const reasons = {
        used: "You have already used your free trial. Subscribe to continue.",
        active: "You already have an active subscription.",
        not_logged_in: "Please log in again, then try once more.",
      };
      msg.textContent = reasons[data.reason] || "Couldn't start your free trial.";
      msg.className = "form-message error";
      btn.style.display = "none";
      return;
    }

    const end = new Date(data.ends_at);
    const when = end.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) +
      " at " + end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    msg.textContent = "Your free trial is active until " + when + ". Enjoy learning!";
    msg.className = "form-message success";
    btn.style.display = "none";
    setTimeout(() => window.location.reload(), 2200);
  });
}