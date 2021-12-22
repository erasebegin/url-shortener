import { render, screen, fireEvent } from "@testing-library/react";
import ShortenUrlForm from "../ShortenUrlForm";

test("component renders correctly", () => {
  const form = render(<ShortenUrlForm />);

  expect(form).toMatchSnapshot();
});

test("initial conditions", () => {
  render(<ShortenUrlForm />);

  const urlInput = screen.getByPlaceholderText(/enter url/i, {
    name: "url-input",
  });

  expect(urlInput.value).toBe("");

  const aliasInput = screen.getByPlaceholderText(/custom name/i, {
    name: "alias-input",
  });

  expect(aliasInput.value).toBe("");
});

test("should not allow empty url on submit", () => {
  render(<ShortenUrlForm />);

  const urlInput = screen.getByPlaceholderText(/enter url/i, {
    name: "url-input",
  });

  const submitButton = screen.getByText(/submit/i);

  fireEvent.change(urlInput, {
    target: {
      value: "",
    },
  });

  fireEvent.click(submitButton);

  expect(screen.getByText(/please enter a url/i)).toBeVisible();
});

test("should not allow duplicate alias on submit", () => {
  render(<ShortenUrlForm />);

  const urlInput = screen.getByPlaceholderText(/enter url/i, {
    name: "url-input",
  });

  const aliasInput = screen.getByPlaceholderText(/custom name/i, {
    name: "alias-input",
  });

  const submitButton = screen.getByText(/submit/i);

  fireEvent.change(urlInput, {
    target: {
      value: "www.ecosia.com",
    },
  });

  fireEvent.change(aliasInput, {
    target: {
      value: "test",
    },
  });

  fireEvent.click(submitButton);

  //wait for server response
  setTimeout(() => {
    expect(
      screen.getByText("custom url already exists", { exact: false })
    ).toBeVisible();
  }, 1000);
});
