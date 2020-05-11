const genCode = () => {
  let output = document.getElementById("output");
  const pageTitle = document.getElementById("pagetitle").value;
  const rawDialog = document.getElementById("dialog").value;
  const choice1 = document.getElementById("choice1").value;
  const action1 = document.getElementById("action1").value;
  const nextPage1 = document.getElementById("nextpage1").value;
  const choice2 = document.getElementById("choice2").value;
  const action2 = document.getElementById("action2").value;
  const nextPage2 = document.getElementById("nextpage2").value;

  const dialog = "<p>" + rawDialog.replace(/\n/g, "</p><p>") + "</p>";

  if (choice2 === "" && action2 === "" && nextPage2 === "") {
    output.value = `const ${pageTitle} = Page.dialog(<>${dialog}</>,).addChoice('${choice1}', '${action1}', () => ${nextPage1});`;
  } else {
    output.value = `const ${pageTitle} = Page.dialog(<>${dialog}</>,).addChoice('${choice1}', '${action1}', () => ${nextPage1}).addChoice('${choice2}', '${action2}', () => ${nextPage2});`;
  }
};
submit.addEventListener("click", genCode);

/*
Expected output:

const ${pageTitle} = Page.dialog(
    <>
        ${Formatted HTML Dialog}
    </>,
    )
    .addChoice('${Choice}', '${ActionPhrase}', () => ${NextPageTitle})
    .addChoice('${Choice}', '${ActionPhrase}', () => ${NextPageTitle})

*/
