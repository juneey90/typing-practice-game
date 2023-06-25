// - [O] 페이지 접속 시 입력창은 비활성화로 표시된다.
// - [O] api로 영어단어를 받기 전이면 버튼이 게임 준비중으로 표시된다.
// - [O] api로 영어단어를 받아오면 버튼이 게임시작으로 표시된다.
// - [O] 게임 시작 버튼을 누르면 타이머가 동작한다.
// - [O] 게임 시작을 버튼을 누르면 출력창에 랜덤으로 단어가 표시된다.
// - [O] 게임 시작을 버튼을 누르면 input창이 활성화된다.
// - [O] Enter를 눌렀을 때 출력창에 값과 입력창의 값이 일치하면 획득점수 5점 오른다.
// - [O] 단어를 성공할 때 마다 출력창에 랜덤으로 단어가 표시된다.
// - [O] 시간 안에 단어를 입력 못하였을 때는 게임이 종료된다.
// - [O] 게임이 종료되면 모든 정보가 초기화된다.
// - [O] 획득 점수가 100점이 되면 "축하합니다. 게임을 클리어 하셨습니다."라는 메시지의 alert이 동작한다.

const init = () => {
  cy.get(".word-input").should("have.text", "");
  cy.get(".word-input").should("have.disabled", "disabled");
  cy.get(".output-window").should("have.text", "Click Start Game");
  cy.get(".time-value").should("have.text", "0");
  cy.get(".score-value").should("have.text", "0");
  cy.get(".button").should("have.text", "게임시작");
};

describe("영어 타이핑 연습 게임 테스트", () => {
  beforeEach("영어 타이핑 연습 게임 페이지 접속", () => {
    cy.visit("../../index.html");
  });

  it("페이지 접속 시 입력창은 비활성화로 표시된다", () => {
    cy.get(".word-input").should("have.disabled", "disabled");
  });

  it("api로 단어를 받아오는 데 성공하기 전까지는 버튼이 게임 준비중으로 표시된다.", () => {
    const notWordBind = cy.get("#invisible-words").length;
    if (!notWordBind) {
      cy.get(".button").should("have.text", "게임로딩중...");
    }
  });

  it("api로 단어를 받아오는 데 성공하면 버튼이 게임시작으로 표시된다.", () => {
    const notWordBind = cy.get("#invisible-words").length;
    if (notWordBind) {
      cy.get(".button").should("have.text, 게임시작");
    }
  });

  it("게임 시작 버튼을 누르면 타이머가 동작한다.", () => {
    if (cy.get(".button").innerText === "게임시작") {
      cy.get(".button").click();
      const time = cy.get(".time-value").innerText;
      cy.get(".time-value").should("have.text", time);
    }
  });

  it("게임 시작을 버튼을 누르면 출력창에 랜덤으로 단어가 표시된다.", () => {
    if (cy.get(".button").innerText === "게임시작") {
      cy.get(".button").click();

      const output = cy.get(".output-window");
      const outputValue = output.innerText;
      if (outputValue !== "Click Start Game") {
        output.should("have.text");
      }
    }
  });

  it("게임 시작을 버튼을 누르면 input창이 활성화된다.", () => {
    if (cy.get(".button").innerText === "게임시작") {
      cy.get(".button").click();
      cy.get(".word-input").should("have.disabled", "");
    }
  });

  it("게임 중인 경우 Enter를 눌렀을 때 출력창에 값과 입력창의 값이 일치하면 획득점수가 5점 오른다.", () => {
    if (cy.get(".button").innerText === "게임중") {
      const inputValue = cy.get(".word-input").value;
      const outputValue = cy.get(".output-window").innerText;

      if (inputValue.should.eqaul(outputValue)) {
        cy.get(".score-value").should("have.text", "5");
      }
    }
  });

  it("단어를 성공할 때 마다 출력창에 다음 단어가 표시된다.", () => {
    if (cy.get(".button").innerText === "게임중") {
      const input = cy.get(".word-input");
      const inputValue = cy.get(".word-input").value;
      const outputValue = cy.get(".output-window").innerText;

      if (inputValue.should.eqaul(outputValue)) {
        input.trigger("keydown", { key: "Enter" });

        if (outputValue !== cy.get(".output-window").innerText) {
          cy.get(".output-window").should(
            "have.text",
            cy.get(".output-window").innerText
          );
        }
      }
    }
  });

  it("남은시간이 0초가 남았으면 게임이 종료된다.", () => {
    let isPlaying;
    isPlaying = cy.get(".time-value").innerText = "0" ? false : true;
    if (!isPlaying) {
      init();
    }
  });

  it("게임이 종료되면 모든 정보가 초기화된다.", () => {
    let isPlaying;
    isPlaying = cy.get(".time-value").innerText = "0" ? false : true;
    if (!isPlaying) {
      init();
    }
  });

  it('획득 점수가 100점이 되면 "축하합니다. 게임을 클리어 하셨습니다. "라는 메시지의 alert이 동작한다.', () => {
    if (cy.get(".score-value").innerText === "100") {
      alert("축하합니다. 게임을 클리어 하셨습니다.");
    }
  });
});
