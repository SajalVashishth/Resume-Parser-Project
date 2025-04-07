async function parseResume() {
  const fileInput = document.getElementById('resumeInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload a resume file.');
    return;
  }

  if (file.type === "application/pdf") {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join("");
        fullText += pageText + "\n";
      }

      console.log(fullText); // Log full text from PDF
      extractInfo(fullText);
    };
    fileReader.readAsArrayBuffer(file);
  } else if (file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = function (e) {
      extractInfo(e.target.result);
    };
    reader.readAsText(file);
  } else {
    alert("Only .txt or .pdf files are supported right now.");
  }
}

function extractInfo(text) {
  console.log(text); // Log the extracted text

  const nameRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i; // Case-insensitive email
  const phoneRegex = /\b(\+?[0-9]{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d]{3}[-.\s]?\d{4}\b/;

  const SkillsList = ['Javascript', 'React', 'Node.js', 'SQL', 'Html', 'CSS', 'Python'];
  const foundSkills = SkillsList.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));

  const name = (text.match(nameRegex) || [''])[0];
  const email = (text.match(emailRegex) || [''])[0];
  const phone = (text.match(phoneRegex) || [''])[0];

  // Update the output
  document.getElementById('name').innerText = name || 'Not found';
  document.getElementById('email').innerText = email || 'Not found';
  document.getElementById('phone').innerText = phone || 'Not found';
  document.getElementById('skills').innerText = foundSkills.length > 0 ? foundSkills.join(', ') : 'Not found';
}
