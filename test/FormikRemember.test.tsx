import { act, render } from '@testing-library/react';
import * as React from 'react';
import { Formik, FormikProps, Field, Form } from 'formik';
import Remember from '../src/FormikRemember';

// tslint:disable-next-line:no-empty
const noop = () => {};

describe('Formik Remember', () => {
  it('loads data on mount', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {() => {
          return (
            <Remember
              name="signup"
              debounceWaitMs={0}
            />
          );
        }}
      </Formik>
    );
    expect(window.localStorage.getItem).toHaveBeenCalled();
  });

  it('sets data on update', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;
          return (
            <Remember
              name="signup"
              debounceWaitMs={0}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setValues({
        name: 'test',
      });
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('custom parse method works', () => {
    (window as any).localStorage = {
      getItem: () => ({
        name: 'storage',
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;
          return (
            <Remember
              name="signup"
              debounceWaitMs={0}
              parse={() => ({
                name: 'parse',
              })}
            />
          );
        }}
      </Formik>
    );

    // @ts-ignore
    expect(injectedFormik.values.name).toBe('parse');
  });

  it('custom dump method works', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Remember
              name="signup"
              debounceWaitMs={0}
              dump={() => 'dump'}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setValues({
        name: 'foo',
      });
    });

    expect(window.localStorage.setItem).toHaveBeenCalledWith('signup', 'dump');
  });

  it('clears data when submitted', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Remember
              name="signup"
              debounceWaitMs={0}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(true);
    });

    unmount();

    expect(window.localStorage.removeItem).toHaveBeenCalled();
  });

  it('does not clear data when not submitted', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Remember
              name="signup"
              debounceWaitMs={0}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(false);
    });

    unmount();

    expect(window.localStorage.removeItem).not.toHaveBeenCalled();
  });

  it('does not save on submit when not valid and saveOnlyOnSubmit is active', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ text: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Form>
              <Field name="text" />
              <Remember
                clearOnOnmount={false}
                saveOnlyOnSubmit={true}
                name="signup"
                debounceWaitMs={0}
              />
            </Form>
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setErrors({
        text: 'Test'
      })
      injectedFormik.setSubmitting(true);
    });

    act(() => {
      injectedFormik.setSubmitting(false);
    });

    unmount();

    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  it('does not save when submitting and saveOnlyOnSubmit is active', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ text: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Form>
              <Field name="text" />
              <Remember
                clearOnOnmount={false}
                saveOnlyOnSubmit={true}
                name="signup"
                debounceWaitMs={0}
              />
            </Form>
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(true);
    });

    unmount();

    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  it('saves on submit when saveOnlyOnSubmit is present', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    const { unmount } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Remember
              clearOnOnmount={false}
              saveOnlyOnSubmit={true}
              name="signup"
              debounceWaitMs={0}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setSubmitting(true);
    });

    act(() => {
      injectedFormik.setSubmitting(false);
    });

    unmount();

    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it('does not save on change when saveOnlyOnSubmit is present', () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    let injectedFormik: FormikProps<any>;

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {formik => {
          injectedFormik = formik;

          return (
            <Remember
              clearOnOnmount={false}
              saveOnlyOnSubmit={true}
              name="signup"
              debounceWaitMs={0}
            />
          );
        }}
      </Formik>
    );

    act(() => {
      injectedFormik.setValues({
        name: 'foo',
      });
    });

    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  it('calls onLoaded after mount', () => {
    (window as any).localStorage = {
      getItem: () => JSON.stringify({
        name: 'bar'
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    const onLoaded = jest.fn();

    render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={noop}>
        {() =>
            <Remember
              clearOnOnmount={false}
              saveOnlyOnSubmit={true}
              name="signup"
              debounceWaitMs={0}
              onLoaded={onLoaded}
            />
        }
      </Formik>
    );

    expect(onLoaded).toBeCalled()
  })

  it('can form still submit', async () => {
    (window as any).localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    const submitFn = jest.fn();
    let injectedFormik: FormikProps<any>;

    const { unmount, getByTestId } = render(
      <Formik initialValues={{ name: 'jared' }} onSubmit={submitFn}>
        {formik => {
          injectedFormik = formik;

          return (
            <Form>
              <button data-testid="button" type="submit" />
              <Remember name="test" />
            </Form>
          );
        }}
      </Formik>
    )

    await act(async () => {
      const button = getByTestId("button");

      await button.click();
    });

    expect(submitFn).toBeCalled()
  })
});
