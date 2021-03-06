import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useOverview from "@hooks/useOverview.hook";
import { RawTeam } from "@type/team.type";
import {
  Card,
  Col,
  Container,
  Form,
  Overlay,
  Pagination,
  Row,
} from "react-bootstrap";
import Spinner from "@components/Spinner/Spinner";
import TeamList from "../../components/TeamList/TeamList";
import styled from "styled-components/macro";
import { debounce } from "lodash";
import { Helmet } from "react-helmet";

interface Props {
  children?: React.ReactNode;
}

const Overview = (props: Props) => {
  const {
    rawTeams,
    rawTeamsLoading,
    pageNum,
    pageLimit,
    setPageNum,
  } = useOverview();

  /* -------------------------- start search function ------------------------- */
  const [userInput, setUserInput] = useState("");
  const [searchResults, setSearchResults] = useState<RawTeam[]>([]);
  const toolTipTarget = useRef(null);

  useEffect(() => {
    if (rawTeams.length) {
      setSearchResults(rawTeams);
    }
  }, [rawTeams, setSearchResults]);

  const searchTeams = useCallback(
    (searchString: string) => {
      const _self = debounce((searchString: string) => {
        setSearchResults(() => {
          const inputLowerCase = searchString.toLowerCase();
          const findTeams = rawTeams.filter((team) => {
            const teamNameLowerCase = team.name.toLocaleLowerCase();
            if (teamNameLowerCase.includes(inputLowerCase)) {
              return true;
            } else {
              return false;
            }
          });
          return findTeams;
        });
      }, 500);
      _self(searchString);
    },
    [setSearchResults, rawTeams]
  );

  const handleOnChange = (searchString: string) => {
    setUserInput(searchString);
  };

  useEffect(() => {
    searchTeams(userInput);
    setPageNum(1);
  }, [userInput, searchTeams, setPageNum]);

  /* ------------------------- end of search function ------------------------- */
  const renderTitle = () => {
    return (
      <Row className="d-flex justify-content-between">
        <Col className="d-flex align-items-center">Overview</Col>
        <Col sm={4} className="d-flex justify-content-end">
          <Form>
            <Form.Control
              ref={toolTipTarget}
              type="text"
              placeholder="search teams"
              value={userInput}
              onChange={(e) => {
                handleOnChange(e.target.value);
              }}
            />
          </Form>
          <Overlay
            target={toolTipTarget.current}
            show={userInput ? true : false}
            placement="bottom"
          >
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
              <div
                {...props}
                style={{
                  backgroundColor: "rgba(30, 30, 30, 0.8)",
                  padding: "2px 10px",
                  color: "white",
                  borderRadius: 3,
                  ...props.style,
                }}
              >
                found {searchResults.length} results
              </div>
            )}
          </Overlay>
        </Col>
      </Row>
    );
  };

  const renderRawTeams = (teams: RawTeam[]) => {
    if (rawTeamsLoading) {
      return <Spinner></Spinner>;
    }

    const start = (pageNum - 1) * pageLimit;
    const end = pageNum * pageLimit;
    const teamSlice = teams.slice(start, end);
    return <TeamList rawTeams={teamSlice}></TeamList>;
  };

  const renderPagination = (teams: RawTeam[]) => {
    const totalPages = Math.ceil(teams.length / pageLimit);
    const pages = [];
    for (let num = 1; num <= totalPages; num++) {
      pages.push(
        <Pagination.Item
          key={`page-${num}`}
          active={num === pageNum}
          onClick={() => setPageNum(num)}
        >
          {num}
        </Pagination.Item>
      );
    }
    return pages;
  };

  // return <>{renderRawTeams(rawTeams)}</>;

  return (
    <>
      <Helmet>
        <title>Team Overview</title>
      </Helmet>
      <Container>
        <Row>
          <OverviewCard>
            <Card.Body>
              <Card.Title>{renderTitle()}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Click team name to view on the new page
              </Card.Subtitle>
              {renderRawTeams(searchResults)}
              <Pagination className="mt-3">
                {renderPagination(searchResults)}
              </Pagination>
            </Card.Body>
          </OverviewCard>
        </Row>
        <Row></Row>
      </Container>
    </>
  );
};

export default Overview;

const OverviewCard = styled(Card)`
  margin-top: 1rem;
  width: 100%;
`;
