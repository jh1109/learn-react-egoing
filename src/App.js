import "./App.css";
import { useState } from "react";
// react에서 제공하는 기본 함수

// 복잡한 UI 구조가 있다.
// 이 복잡한 UI 구조가 1억개라면?
// 사용자가 정의한 하나의 태그로 만들어보자.(사용자 정의 태그)
// 사용자 정의 태그는 함수를 만들면 된다.
function Header(props) {
  // 사용자 정의 함수의 이름은 대문자로 시작!
  // props = 속성을 객체로 반환해줌
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={(e) => {
            // 컨포넌트 내의 태그들은 html 태그들과 똑같지 않다. 유사 태그이다.
            // react가 최종적으로 html이 인식하는 태그로 바꿔준다.
            // 그래서 html과 똑같이 onclick으로 쓰는게 아니라 onClick으로 써야한다.

            e.preventDefault();
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}
// 리액트에서는 이러한 사용자 정의 태그를,
// 컴포넌트 라고 한다!
function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a
          id={t.id}
          href={"/read/" + t.id}
          onClick={(e) => {
            e.preventDefault();
            props.onChangeMode(+e.target.id);
            // 숫자를 태그의 속성으로 넘기면 문자가 됨!
            // 그래서 '숫자'형식으로 반환됨.
          }}
        >
          {t.title}
        </a>
      </li>
    );
    // console에 뜨는 경고 "list should have a unique 'key' prop."
    // 그래서 <li>에 key 값을 추가해줌
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}
function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}
function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title" />
        </p>
        <p>
          <textarea name="body" placeholder="body"></textarea>
        </p>
        <p>
          <input type="submit" value="Create" />
        </p>
      </form>
    </article>
  );
}
const Update = (props) => {
  const [title, setTitle] = useState(props.title);
  const [body, setbody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const title = e.target.title.value;
          const body = e.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={(e) => setbody(e.target.value)}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
};

function App() {
  // const _mode = useState('WELCOME');
  // useState 함수는 배열을 반환한다.
  // 0번째 index에는 해당 값을 반환하고, 초기값
  // 1번째 index에는 해당 값(0번째 index)을 변경할 수 있는 함수를 반환한다.
  // 그래서 아래와 같이 사용할 수 있다.
  // const mode = _mode[0];
  // const setMode = _mode[1];
  // 이를 단순하게!
  const [mode, setMode] = useState("WELCOME");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);

  const [topics, setTopics] = useState([
    { id: 1, title: "html", body: "html is ..." },
    { id: 2, title: "css", body: "css is ..." },
    { id: 3, title: "javascript", body: "javascript is ..." },
  ]);
  let content = null;
  let contextControl = null;
  if (mode === "WELCOME") {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if (mode === "READ") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      // console.log(topics[i].id, id);
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = (
      <>
        <li>
          <a
            href={"/update/" + id}
            onClick={(e) => {
              e.preventDefault();
              setMode("UPDATE");
            }}
          >
            Update
          </a>
        </li>
        <li>
          <input
            type="button"
            value="Delete"
            onClick={() => {
              const newTopics = topics.filter((topic) => topic.id !== id);
              setTopics(newTopics);
              setMode("WELCOME");
            }}
          />
        </li>
      </>
    );
  } else if (mode === "CREATE") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          // 상태를 만들때(useState) 초기값이 primitive 타입(string, number, boolean 등) 일때
          // setMode로 그냥 사용한다.
          // 하지만 초기값이 객체나 배열일 경우에는,
          // 초기값을 spread 연산자(...)를 통해 복제한 다음
          // 수정하여 사용해야 한다. 아래처럼
          // 이유는, useState는 초기값과 변화된 값을 비교한다음,
          // 둘의 차이가 있을 때만 usetMode 값을 렌더링 한다.
          // 만약 복제하지 않고 원본값을 수정한다음 비교하면 당연히 같으니 렌더링 되지 않는다.
          // 그래서 원본을 지키기 위해 복제를 한다음 비교를 시키는 것이다. 수정하면 원본값과 달라지니까
          const newTopics = [...topics];
          newTopics.push(newTopic);
          setTopics(newTopics);
          setMode("READ");
          setId(nextId);
          setNextId(nextId + 1);
        }}
      ></Create>
    );
  } else if (mode === "UPDATE") {
    let title,
      body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          const newTopics = [...topics];
          const updatedTopic = { id: id, title: title, body: body };
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = updatedTopic;
              break;
            }
          }
          setTopics(newTopics);
          setMode("READ");
        }}
      ></Update>
    );
  }
  return (
    <div>
      <Header title="WEB" onChangeMode={() => setMode("WELCOME")}></Header>
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          setMode("READ");
          setId(_id);
        }}
      ></Nav>
      {/* 왜 처음에 함수안에 mode = 'WELCOME' 때는 동작을 안하는가?
        App()함수가 한번 동작하고 말기 때문,
        하지만 이렇게 setMode를 사용해주면 App()함수가 다시 동작해서,
        mode가 바뀌었기 때문에 그에 맞는 UI가 변경된 거임 */}
      {content}
      <ul>
        <li>
          <a
            href="/create"
            onClick={(e) => {
              e.preventDefault();
              setMode("CREATE");
            }}
          >
            Create
          </a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
